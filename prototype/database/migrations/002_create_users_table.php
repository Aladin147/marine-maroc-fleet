<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('password');
            $table->enum('role', ['admin', 'dispatcher', 'manager'])->default('dispatcher');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['company_id', 'email']);
            $table->index('company_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
