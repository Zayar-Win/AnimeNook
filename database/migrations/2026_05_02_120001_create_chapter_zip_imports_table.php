<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chapter_zip_imports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('zip_storage_path');
            $table->string('status', 20)->default('pending');
            $table->unsignedSmallInteger('pages_imported')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['chapter_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapter_zip_imports');
    }
};
