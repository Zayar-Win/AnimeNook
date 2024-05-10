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
        $links = [
            'youtube' => '',
            'telegram' => '',
            'facebook' => '',
            'titok' => ''
        ];
        Schema::create('group_settings', function (Blueprint $table) use ($links) {
            $table->id();
            $table->string('primary_color');
            $table->json('social_links');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_settings');
    }
};
