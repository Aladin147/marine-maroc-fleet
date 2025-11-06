<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('plate_number');
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->integer('year')->nullable();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['company_id', 'plate_number']);
            $table->index('company_id');
            $table->index('driver_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
