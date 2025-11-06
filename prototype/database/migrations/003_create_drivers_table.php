<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('password')->nullable(); // For mobile app login
            $table->enum('status', ['available', 'on_trip', 'offline', 'busy'])->default('offline');
            $table->json('current_location')->nullable(); // {lat, lng, timestamp}
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('company_id');
            $table->index('status');
            $table->unique(['company_id', 'phone']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
