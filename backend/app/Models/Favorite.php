<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Food;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'food_id'];

    // Relation vers le produit
    public function food()
    {
        return $this->belongsTo(Food::class, 'food_id');
    }

    // Relation vers l’utilisateur (client)
    public function client()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
