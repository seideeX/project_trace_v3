<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pr_date'                    => ['required', 'date'],
            'entity_name'                => ['required', 'string', 'max:255'],
            'fund_cluster'               => ['nullable', 'string', 'max:255'],
            'office_section'             => ['nullable', 'string', 'max:255'],
            'responsibility_center_code' => ['nullable', 'string', 'max:255'],

            'purpose'                    => ['nullable', 'string'],
            'program_title'              => ['nullable', 'string', 'max:255'],
            'fund_source'                => ['nullable', 'string', 'max:255'],
            'sub_aro_no'                 => ['nullable', 'string', 'max:255'],

            'implementation_date'        => ['nullable', 'string', 'max:255'],
            'focal_person'               => ['nullable', 'string', 'max:255'],

            'ar_atc_no'                  => ['nullable', 'string', 'max:255'],
            'with_wafp'                  => ['boolean'],
            'included_in_app'            => ['boolean'],
            'included_in_ppmp'           => ['boolean'],

            'requested_by_name'          => ['nullable', 'string', 'max:255'],
            'requested_by_designation'   => ['nullable', 'string', 'max:255'],
            'recommended_by_name'        => ['nullable', 'string', 'max:255'],
            'recommended_by_designation' => ['nullable', 'string', 'max:255'],
            'approved_by_name'           => ['nullable', 'string', 'max:255'],
            'approved_by_designation'    => ['nullable', 'string', 'max:255'],

            'certified_allotment'        => ['nullable', 'numeric', 'min:0'],
            'certified_by_name'          => ['nullable', 'string', 'max:255'],
            'certified_by_designation'   => ['nullable', 'string', 'max:255'],

            'items'                      => ['required', 'array', 'min:1'],
            'items.*.stock_property_no'  => ['nullable', 'string', 'max:255'],
            'items.*.unit'               => ['nullable', 'string', 'max:255'],
            'items.*.item_description'   => ['required', 'string'],
            'items.*.quantity'           => ['required', 'numeric', 'gt:0'],
            'items.*.unit_cost'          => ['required', 'numeric', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'pr_date' => 'date',
            'entity_name' => 'entity name',
            'fund_cluster' => 'fund cluster',
            'office_section' => 'office/section',
            'responsibility_center_code' => 'responsibility center code',

            'items.*.stock_property_no' => 'stock/property number',
            'items.*.unit' => 'unit',
            'items.*.item_description' => 'item description',
            'items.*.quantity' => 'quantity',
            'items.*.unit_cost' => 'unit cost',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Add at least one item to the purchase request.',
            'items.min' => 'Add at least one item to the purchase request.',

            'items.*.item_description.required' =>
                'The item description is required.',

            'items.*.quantity.required' =>
                'The quantity is required.',

            'items.*.quantity.numeric' =>
                'The quantity must be a number.',

            'items.*.quantity.gt' =>
                'The quantity must be greater than 0.',

            'items.*.unit_cost.required' =>
                'The unit cost is required.',

            'items.*.unit_cost.numeric' =>
                'The unit cost must be a number.',

            'items.*.unit_cost.min' =>
                'The unit cost cannot be negative.',
        ];
    }
}
