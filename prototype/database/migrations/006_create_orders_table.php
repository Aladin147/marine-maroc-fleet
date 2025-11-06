<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->enum('status', ['new', 'assigned', 'in_progress', 'completed', 'cancelled'])->default('new');
            
            // Locations
            $table->foreignId('pickup_location_id')->nullable()->constrained('locations')->onDelete('set null');
            $table->foreignId('delivery_location_id')->nullable()->constrained('locations')->onDelete('set null');
            
            // Assignment
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->onDelete('set null');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->onDelete('set null');
            
            // Timestamps
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            // Additional info
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // cargo details, customer info, etc.
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('company_id');
            $table->index('status');
            $table->index('driver_id');
            $table->index(['company_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
