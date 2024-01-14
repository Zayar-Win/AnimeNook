<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mangas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->string('name');
            $table->string('slug');
            $table->text('description');
            $table->string('thumbnail');
            $table->bigInteger('rating');
            $table->bigInteger('views_count')->default(0);
            $table->bigInteger('likes_count')->default(0);
            $table->unsignedBigInteger('status_id')->default(1);
            $table->boolean('is_trending')->default(false);
            $table->boolean('is_recommended')->default(false);
            $table->string('background_image')->nullable();
            $table->string('transparent_background')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manga');
    }
};
