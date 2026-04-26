<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('upload_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->string('target', 50);
            $table->string('original_name');
            $table->string('mime', 255)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('stored_url')->nullable();
            $table->string('status', 20)->default('uploading');
            $table->timestamps();

            $table->index(['group_id', 'user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('upload_sessions');
    }
};

