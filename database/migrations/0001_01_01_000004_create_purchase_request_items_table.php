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
        Schema::create('purchase_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_request_id')
                ->constrained('purchase_requests')
                ->cascadeOnDelete();
            // PR Item Details
            $table->string('stock_property_no')
                ->nullable();
            $table->string('unit')
                ->nullable();
            $table->text('item_description');
            $table->decimal('quantity', 15, 2)
                ->default(1);
            $table->decimal('unit_cost', 15, 2)
                ->default(0);
            $table->decimal('total_cost', 15, 2)
                ->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_request_items');
    }
};
