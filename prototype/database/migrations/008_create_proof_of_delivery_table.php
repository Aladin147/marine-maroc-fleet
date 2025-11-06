<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proof_of_delivery', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->json('photos')->nullable(); // Array of photo URLs
            $table->string('signature_url')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('delivered_at');
            $table->timestamps();
            
            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proof_of_delivery');
    }
};
