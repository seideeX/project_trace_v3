<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ownership and draft status are checked in the controller.
        return true;
    }

    /**
     * Keep these in sync with StorePurchaseRequestRequest.
     * The only difference is that items may carry an existing `id`.
     */
    public function rules(): array
    {
        return [
            // Basic PR information
            'pr_date' => ['required', 'date'],
            'entity_name' => ['required', 'string', 'max:255'],
            'fund_cluster' => ['nullable', 'string', 'max:255'],
            'office_section' => ['nullable', 'string', 'max:255'],
            'responsibility_center_code' => ['nullable', 'string', 'max:255'],

            // Purpose / program
            'purpose' => ['nullable', 'string'],
            'program_title' => ['nullable', 'string', 'max:255'],
            'fund_source' => ['nullable', 'string', 'max:255'],
            'sub_aro_no' => ['nullable', 'string', 'max:255'],

            // Implementation
            'implementation_date' => ['nullable', 'string', 'max:255'],
            'focal_person' => ['nullable', 'string', 'max:255'],

            // Planning references
            'ar_atc_no' => ['nullable', 'string', 'max:255'],
            'with_wafp' => ['boolean'],
            'included_in_app' => ['boolean'],
            'included_in_ppmp' => ['boolean'],

            // Signatories
            'requested_by_name' => ['nullable', 'string', 'max:255'],
            'requested_by_designation' => ['nullable', 'string', 'max:255'],
            'recommended_by_name' => ['nullable', 'string', 'max:255'],
            'recommended_by_designation' => ['nullable', 'string', 'max:255'],
            'approved_by_name' => ['nullable', 'string', 'max:255'],
            'approved_by_designation' => ['nullable', 'string', 'max:255'],

            // Budget certification
            'certified_allotment' => ['nullable', 'numeric', 'min:0'],
            'certified_by_name' => ['nullable', 'string', 'max:255'],
            'certified_by_designation' => ['nullable', 'string', 'max:255'],

            // Note sent to the reviewer when resubmitting
            'comment' => ['nullable', 'string', 'max:2000'],

            // Items
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['nullable', 'integer'],
            'items.*.stock_property_no' => ['nullable', 'string', 'max:255'],
            'items.*.unit' => ['nullable', 'string', 'max:50'],
            'items.*.item_description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
            'items.*.total_cost' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Add at least one item.',
            'items.*.item_description.required' => 'Each item needs a description.',
            'items.*.quantity.required' => 'Each item needs a quantity.',
            'items.*.unit_cost.required' => 'Each item needs a unit cost.',
        ];
    }
}
