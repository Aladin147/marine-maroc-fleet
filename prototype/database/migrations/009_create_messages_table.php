<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            
            // Sender (can be user or driver)
            $table->foreignId('from_user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('from_driver_id')->nullable()->constrained('drivers')->onDelete('cascade');
            
            // Receiver (can be user or driver)
            $table->foreignId('to_user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('to_driver_id')->nullable()->constrained('drivers')->onDelete('cascade');
            
            // Message content
            $table->enum('type', ['text', 'voice'])->default('text');
            $table->text('content')->nullable(); // For text messages
            $table->string('audio_url')->nullable(); // For voice messages
            $table->integer('duration')->nullable(); // Voice message duration in seconds
            
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            
            $table->index('company_id');
            $table->index(['from_user_id', 'to_driver_id']);
            $table->index(['from_driver_id', 'to_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
