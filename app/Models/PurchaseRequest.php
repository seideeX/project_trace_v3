<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'pr_no',
        'pr_date',
        'entity_name',
        'fund_cluster',
        'office_section',
        'responsibility_center_code',
        'purpose',
        'program_title',
        'fund_source',
        'sub_aro_no',
        'implementation_date',
        'focal_person',
        'ar_atc_no',
        'with_wafp',
        'included_in_app',
        'included_in_ppmp',

        'requested_by',
        'requested_by_name',
        'requested_by_designation',

        'recommended_by',
        'recommended_by_name',
        'recommended_by_designation',

        'approved_by',
        'approved_by_name',
        'approved_by_designation',

        'certified_allotment',
        'certified_by',
        'certified_by_name',
        'certified_by_designation',

        'status',
    ];

    protected function casts(): array
    {
        return [
            'pr_date' => 'date',
            'with_wafp' => 'boolean',
            'included_in_app' => 'boolean',
            'included_in_ppmp' => 'boolean',
            'certified_allotment' => 'decimal:2',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(PurchaseRequestFeedback::class);
    }

    public function latestFeedback()
    {
        return $this->hasOne(PurchaseRequestFeedback::class)
            ->latestOfMany();
    }
}
