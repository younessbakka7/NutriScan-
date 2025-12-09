<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
     protected $table = 'foods';
    protected $fillable = [
    'name', 'calories', 'sugar', 'fat', 'protein', 'salt', 'grade',  'image',
    'barcode','description',
];
}
