<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequestRequest;
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
        //
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
                // Generate PR number inside the transaction
                // so concurrent saves can't take the same number.
                $data['pr_no'] = $this->generatePrNo($data['pr_date']);
                $data['requested_by'] = auth()->id();

                $purchaseRequest = PurchaseRequest::create($data);

                $purchaseRequest->items()->createMany(
                    collect($items)->map(fn ($item) => [
                        'stock_property_no' => $item['stock_property_no'] ?? null,
                        'unit'              => $item['unit'] ?? null,
                        'item_description'  => $item['item_description'],
                        'quantity'          => $item['quantity'],
                        'unit_cost'         => $item['unit_cost'],

                        // Never trust the client total
                        'total_cost'        => round(
                            $item['quantity'] * $item['unit_cost'],
                            2
                        ),
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
                ->with('success', "Purchase Request {$purchaseRequest->pr_no} created successfully.");

        } catch (\Throwable $e) {
            // Log the actual error for debugging
            \Log::error('Failed to create Purchase Request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to create the Purchase Request. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseRequest $purchaseRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseRequest $purchaseRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseRequest $purchaseRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        //
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
