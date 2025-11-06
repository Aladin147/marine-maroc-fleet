<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracking_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained()->onDelete('cascade');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->decimal('accuracy', 8, 2)->nullable(); // meters
            $table->decimal('speed', 8, 2)->nullable(); // km/h
            $table->decimal('heading', 5, 2)->nullable(); // degrees
            $table->timestamp('recorded_at');
            $table->timestamps();
            
            $table->index('driver_id');
            $table->index(['driver_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_points');
    }
};
