<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**group_id
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chapters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('chapterable_id');
            $table->string('chapterable_type');
            $table->bigInteger('chapter_number');
            $table->enum('type', ['link', 'pdf']);
            $table->bigInteger('like_count');
            $table->bigInteger('view_count');
            $table->text('description');
            $table->text('name');
            $table->text('chapter_link')->nullable();
            $table->text('thumbnail')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chapters');
    }
};
