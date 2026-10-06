<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequestRequest;
use App\Http\Requests\UpdatePurchaseRequestRequest;
use App\Models\PurchaseRequest;
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
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchaseRequests = PurchaseRequest::with([
            'latestFeedback',
            'requested_by:id,name',
        ])
            ->where('requested_by', auth()->id())
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
            'queryParams' => request()->query(),
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

                // Sum the total_cost of all items
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
                    'action' => 'pending',
                    'feedback' => 'Purchase Request submitted for Procurement review.',
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
                ->orderByDesc('created_at')
                ->orderByDesc('id'),
        ]);

        return Inertia::render('PR/Show', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->load(['requested_by:id,name', 'items']);

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
        unset($data['items']);

        try {
            DB::transaction(function () use ($purchaseRequest, $data, $items) {
                // pr_no, requested_by and status are never changed from the form
                $data['amount'] = round($items->sum('total_cost'), 2);

                $purchaseRequest->update($data);

                $this->syncItems($purchaseRequest, $items);
            });

            return redirect()
                ->route('purchase-request.show', $purchaseRequest)
                ->with(
                    'success',
                    "Purchase Request {$purchaseRequest->pr_no} updated successfully."
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
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        //
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
