<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('foods', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->integer('calories')->nullable();
        $table->float('sugar')->nullable();
        $table->float('fat')->nullable();
        $table->float('protein')->nullable();
        $table->float('salt')->nullable();
        $table->string('grade')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
