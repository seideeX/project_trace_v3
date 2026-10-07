<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
                // Basic PR Information
                $table->string('pr_no')->unique();
                $table->date('pr_date');
                $table->string('entity_name')
                    ->default('Department of Education - Schools Division Office of the City of Ilagan');
                $table->string('fund_cluster')
                    ->nullable();
                $table->string('office_section')
                    ->nullable();
                $table->string('responsibility_center_code')
                    ->nullable();
                $table->string('amount')
                    ->nullable();
                // Purpose / Program
                $table->text('purpose')
                    ->nullable();
                $table->string('program_title')
                    ->nullable();
                $table->string('fund_source')
                    ->nullable();
                $table->string('sub_aro_no')
                    ->nullable();
                // Implementation
                $table->string('implementation_date')
                    ->nullable();
                $table->string('focal_person')
                    ->nullable();
                // Procurement / Planning References
                $table->string('ar_atc_no')
                    ->nullable();
                $table->boolean('with_wafp')
                    ->default(false);
                $table->boolean('included_in_app')
                    ->default(false);
                $table->boolean('included_in_ppmp')
                    ->default(false);
                // Signatories
                $table->foreignId('requested_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
                $table->string('requested_by_name')
                    ->nullable();
                $table->string('requested_by_designation')
                    ->nullable();
                $table->foreignId('recommended_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
                $table->string('recommended_by_name')
                    ->nullable();
                $table->string('recommended_by_designation')
                    ->nullable();
                $table->foreignId('approved_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
                $table->string('approved_by_name')
                    ->nullable();
                $table->string('approved_by_designation')
                    ->nullable();
                // Budget Certification
                $table->decimal('certified_allotment', 15, 2)
                    ->nullable();
                $table->foreignId('certified_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
                $table->string('certified_by_name')
                    ->nullable();
                $table->string('certified_by_designation')
                    ->nullable();
                // Workflow
                $table->enum('status', [
                    'draft',
                    'submitted',
                    'under_review',
                    'revision_requested',
                    'approved',
                    'rejected',
                    'cancelled',
                ])->default('draft');
                $table->timestamps();
                $table->softDeletes();
            });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
