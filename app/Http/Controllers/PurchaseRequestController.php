<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequestRequest;
use App\Http\Requests\UpdatePurchaseRequestRequest;
use App\Models\Department;
use App\Models\PurchaseRequest;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseRequestController extends Controller
{
    /**
     * true  => sequence restarts every month (25-12-001, 26-01-001, ...)
     * false => sequence runs through the whole year (25-11-053, 25-12-054, ...)
     */
    protected bool $resetMonthly = false;

    /**
     * Statuses accepted by the ?status= filter.
     */
    protected const STATUSES = ['draft', 'submitted', 'approved', 'rejected'];

    /**
     * users.position values used to find the signatories on the printed form.
     * Add the spellings you actually use (exact match, case-insensitive).
     */
    protected const ASDS_POSITIONS = ['Assistant Schools Division Superintendent', 'ASDS'];
    protected const SDS_POSITIONS = ['Schools Division Superintendent', 'SDS'];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('admin');

        // Filters live in the URL: ?search=&pr_status=&origin_department=&date_from=&date_to=
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('pr_status');
        $departmentId = $request->query('origin_department');

        // Ignore anything that is not a plain Y-m-d date
        $validDate = fn ($value) => is_string($value) && Carbon::hasFormat($value, 'Y-m-d')
            ? $value
            : null;

        $dateFrom = $validDate($request->query('date_from'));
        $dateTo = $validDate($request->query('date_to'));

        $purchaseRequests = PurchaseRequest::with([
            'latestFeedback',
            'requested_by:id,name,department_id',
            'requested_by.department:id,name',
        ])
            // Non-admins only ever see their own requests
            ->when(
                ! $isAdmin,
                fn ($query) => $query->where('requested_by', $user->id)
            )
            // Department of the user who made the request (admins only)
            ->when(
                $isAdmin && filled($departmentId),
                fn ($query) => $query->whereHas(
                    'requested_by',
                    fn ($requester) => $requester->where('department_id', $departmentId)
                )
            )
            ->when(
                in_array($status, self::STATUSES, true),
                fn ($query) => $query->where('status', $status)
            )
            ->when(
                $dateFrom,
                fn ($query) => $query->whereDate('pr_date', '>=', $dateFrom)
            )
            ->when(
                $dateTo,
                fn ($query) => $query->whereDate('pr_date', '<=', $dateTo)
            )
            ->when($search !== '', function ($query) use ($search) {
                // Escape LIKE wildcards typed by the user
                $like = '%' . addcslashes($search, '%_\\') . '%';

                $query->where(function ($query) use ($like) {
                    $query->where('pr_no', 'like', $like)
                        ->orWhere('purpose', 'like', $like)
                        ->orWhere('program_title', 'like', $like)
                        ->orWhere('office_section', 'like', $like)
                        ->orWhereHas(
                            'requested_by',
                            fn ($requester) => $requester->where('name', 'like', $like)
                        );
                });
            })
            ->orderByDesc('pr_date')
            ->orderByDesc('created_at')
            ->select([
                'id',
                'pr_no',
                'pr_date',
                'purpose',
                'status',
                'amount',
                'requested_by',
            ])
            ->get();

        return Inertia::render('PR/Index', [
            'purchaseRequests' => $purchaseRequests,
            'queryParams' => $request->query(),
            'isAdmin' => $isAdmin,
            'departments' => $isAdmin
                ? Department::orderBy('name')->pluck('name', 'id')
                : [],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('PR/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseRequestRequest $request)
    {
        $data = $request->validated();
        $items = $data['items'];
        unset($data['items']);

        try {
            $purchaseRequest = DB::transaction(function () use ($data, $items) {

                $data['pr_no'] = $this->generatePrNo($data['pr_date']);
                $data['requested_by'] = auth()->id();

                // PR is immediately submitted to Procurement
                $data['status'] = 'submitted';

                // Calculate total amount from items
                $data['amount'] = round(
                    collect($items)->sum(
                        fn ($item) => (float) $item['total_cost']
                    ),
                    2
                );

                $purchaseRequest = PurchaseRequest::create($data);

                $purchaseRequest->items()->createMany(
                    collect($items)->map(fn ($item) => [
                        'stock_property_no' => $item['stock_property_no'] ?? null,
                        'unit'              => $item['unit'] ?? null,
                        'item_description'  => $item['item_description'],
                        'quantity'          => $item['quantity'],
                        'unit_cost'         => $item['unit_cost'],
                        'total_cost'        => $item['total_cost'],
                    ])->all()
                );

                $purchaseRequest->feedbacks()->create([
                    'action' => 'submitted',
                    'feedback' => 'Purchase Request submitted for Procurement review.',
                    'created_by' => auth()->id(),
                ]);

                return $purchaseRequest;
            });

            return redirect()
                ->route('purchase-request.index')
                ->with(
                    'success',
                    "Purchase Request {$purchaseRequest->pr_no} created successfully."
                );

        } catch (\Throwable $e) {
            \Log::error('Failed to create Purchase Request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with(
                    'error',
                    'Failed to create the Purchase Request. Please try again.'
                );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->load([
            'requested_by:id,name',
            'items',
            'latestFeedback',
            'feedbacks' => fn ($query) => $query
                ->with('createdBy:id,name')
                ->orderByDesc('created_at')
                ->orderByDesc('id'),
        ]);

        return Inertia::render('PR/Show', [
            'purchaseRequest' => $purchaseRequest,
            'isAdmin' => $this->isAdmin(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->load([
            'requested_by:id,name',
            'items',
            // Recent feedback, so the owner can see what to address
            'feedbacks' => fn ($query) => $query
                ->with('createdBy:id,name')
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->limit(5),
        ]);

        return Inertia::render('PR/Edit', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseRequestRequest $request, PurchaseRequest $purchaseRequest)
    {
        $data = $request->validated();
        $items = $this->normalizeItems($data['items']);
        $comment = trim((string) ($data['comment'] ?? ''));
        unset($data['items'], $data['comment']);

        try {
            DB::transaction(function () use ($purchaseRequest, $data, $items, $comment) {
                // pr_no and requested_by are never changed from the form
                $data['amount'] = round($items->sum('total_cost'), 2);

                // Editing resubmits the PR for review
                $data['status'] = 'submitted';

                $purchaseRequest->update($data);

                $this->syncItems($purchaseRequest, $items);

                // Record the resubmission so the reviewer sees the note
                $purchaseRequest->feedbacks()->create([
                    'action'     => 'resubmitted',
                    'feedback'   => $comment !== ''
                        ? $comment
                        : 'Purchase Request updated and resubmitted.',
                    'created_by' => auth()->id(),
                ]);
            });

            return redirect()
                ->route('purchase-request.show', $purchaseRequest)
                ->with(
                    'success',
                    "Purchase Request {$purchaseRequest->pr_no} updated and resubmitted."
                );

        } catch (\Throwable $e) {
            \Log::error('Failed to update Purchase Request', [
                'purchase_request_id' => $purchaseRequest->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with(
                    'error',
                    'Failed to update the Purchase Request. Please try again.'
                );
        }
    }

    /**
     * Admin review: approve or reject a purchase request.
     * A comment is always required.
     */
    public function storeFeedback(Request $request, PurchaseRequest $purchaseRequest)
    {
        abort_unless($this->isAdmin(), 403);

        $validated = $request->validate([
            'action' => ['required', 'in:approved,rejected'],
            'feedback' => ['required', 'string', 'max:2000'],
        ], [
            'feedback.required' => 'Please write a comment before approving or rejecting.',
        ]);

        if (in_array($purchaseRequest->status, ['approved', 'rejected'])) {
            return redirect()
                ->back()
                ->with('error', "This purchase request was already {$purchaseRequest->status}.");
        }

        DB::transaction(function () use ($purchaseRequest, $validated) {
            $purchaseRequest->update(['status' => $validated['action']]);

            $purchaseRequest->feedbacks()->create([
                'action' => $validated['action'],
                'feedback' => $validated['feedback'],
                'created_by' => auth()->id(),
            ]);
        });

        $verb = $validated['action'] === 'approved' ? 'approved' : 'rejected';

        return redirect()
            ->back()
            ->with('success', "Purchase Request {$purchaseRequest->pr_no} {$verb}.");
    }

    /**
     * Download the approved purchase request as a PDF (Appendix 51 form).
     */
    public function print(PurchaseRequest $purchaseRequest)
    {
        if ($purchaseRequest->status !== 'approved') {
            return redirect()
                ->route('purchase-request.show', $purchaseRequest)
                ->with('error', 'Only approved purchase requests can be printed.');
        }

        $purchaseRequest->load([
            'items' => fn ($query) => $query->orderBy('id'),
            'requested_by:id,name,position',
        ]);

        // Budget head, ASDS and SDS names/designations (print only, nothing is saved)
        $this->fillSignatories($purchaseRequest);

        $pdf = Pdf::loadView('purcahse_request', [
            'pr' => $purchaseRequest,
            // `requested_by` is both a column and a relation, so read the relation explicitly
            'requester' => $purchaseRequest->getRelation('requested_by'),
        ])->setPaper('a4', 'portrait');

        return $pdf->download("PR-{$purchaseRequest->pr_no}.pdf");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        //
    }

    /**
     * Fill the signatories printed on the PR form.
     *
     * For each of certified_by (head of budget), recommended_by (ASDS) and
     * approved_by (SDS): values already stored on the PR win, then the user
     * saved in the *_by column, then the current office holder from `users`.
     * The values are only set in memory, so they affect the PDF only.
     */
    protected function fillSignatories(PurchaseRequest $purchaseRequest): void
    {
        $officeHolders = [
            // Head of the Budget department
            'certified_by' => fn () => User::query()
                ->where('is_head', true)
                ->whereHas('department', fn ($query) => $query->where('name', 'like', '%budget%'))
                ->first(),

            // Assistant Schools Division Superintendent
            'recommended_by' => fn () => User::query()
                ->whereIn('position', self::ASDS_POSITIONS)
                ->first(),

            // Schools Division Superintendent
            'approved_by' => fn () => User::query()
                ->whereIn('position', self::SDS_POSITIONS)
                ->first(),
        ];

        foreach ($officeHolders as $column => $findOfficeHolder) {
            $nameKey = "{$column}_name";
            $designationKey = "{$column}_designation";

            if (filled($purchaseRequest->{$nameKey}) && filled($purchaseRequest->{$designationKey})) {
                continue;
            }

            $savedUserId = $purchaseRequest->getRawOriginal($column);

            $user = ($savedUserId ? User::find($savedUserId) : null)
                ?? $findOfficeHolder();

            if (! $user) {
                continue;
            }

            if (blank($purchaseRequest->{$nameKey})) {
                $purchaseRequest->setAttribute($nameKey, $user->name);
            }

            if (blank($purchaseRequest->{$designationKey})) {
                $purchaseRequest->setAttribute($designationKey, $user->position);
            }
        }

        // "Requested by" designation falls back to the requester's position
        $requester = $purchaseRequest->getRelation('requested_by');

        if ($requester && blank($purchaseRequest->requested_by_designation)) {
            $purchaseRequest->setAttribute('requested_by_designation', $requester->position);
        }
    }

    protected function isAdmin(): bool
    {
        return auth()->user()?->hasRole('admin') ?? false;
    }

    /**
     * Recompute total_cost on the server so the client value is never trusted.
     */
    protected function normalizeItems(array $items)
    {
        return collect($items)->map(function ($item) {
            $quantity = (float) $item['quantity'];
            $unitCost = (float) $item['unit_cost'];

            return [
                'id'                => $item['id'] ?? null,
                'stock_property_no' => $item['stock_property_no'] ?? null,
                'unit'              => $item['unit'] ?? null,
                'item_description'  => $item['item_description'],
                'quantity'          => $quantity,
                'unit_cost'         => $unitCost,
                'total_cost'        => round($quantity * $unitCost, 2),
            ];
        });
    }

    /**
     * Update rows that have an id, create rows without one,
     * and delete rows that were not sent back.
     */
    protected function syncItems(PurchaseRequest $purchaseRequest, $items): void
    {
        $existingIds = $purchaseRequest->items()->pluck('id')->all();

        // Only trust ids that belong to this purchase request
        $keepIds = $items
            ->pluck('id')
            ->filter(fn ($id) => $id && in_array($id, $existingIds))
            ->values()
            ->all();

        $purchaseRequest->items()->whereNotIn('id', $keepIds)->delete();

        foreach ($items as $item) {
            $id = $item['id'];
            unset($item['id']);

            if ($id && in_array($id, $existingIds)) {
                $purchaseRequest->items()->whereKey($id)->update($item);
            } else {
                $purchaseRequest->items()->create($item);
            }
        }
    }

    /**
     * Build the next PR number, format YY-MM-NNN (e.g. 25-12-054).
     * Must be called inside a DB transaction (uses lockForUpdate).
     */
    protected function generatePrNo(string $date): string
    {
        $date  = Carbon::parse($date);
        $year  = $date->format('y');
        $month = $date->format('m');

        $pattern = $this->resetMonthly
            ? "{$year}-{$month}-%"
            : "{$year}-%";

        $last = PurchaseRequest::withTrashed() // never reuse a deleted PR's number
            ->where('pr_no', 'like', $pattern)
            ->lockForUpdate()
            ->pluck('pr_no')
            ->map(fn ($no) => (int) last(explode('-', $no)))
            ->max() ?? 0;

        return sprintf('%s-%s-%03d', $year, $month, $last + 1);
    }
}
