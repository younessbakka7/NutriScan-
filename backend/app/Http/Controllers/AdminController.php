<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
 use App\Models\Favorite;

class AdminController extends Controller
{
    //view login form
    public function showLoginForm()
    {
        return response()->json([
            'message' => 'Send POST request with email/username and password to login'
        ]);
    }

    
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',   
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                    ->where('role', 'admin')    
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

         
        Auth::login($user);
    $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token

            
           
        ]);
    }

    
  public function dashboard(Request $request)
{
    $admin = $request->user(); // get logged admin

    return response()->json([
        'message' => 'Admin Dashboard',
        'admin' => [
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => $admin->role,
            'created_at' => $admin->created_at->toDateTimeString()
        ]
    ]);

    

}
// Lister tous les clients
    public function clientList()
    {
    $users = User::where('role', 'client')->get();
    return response()->json([
        'users' => $users
    ]);
}

    // Supprimer un client
    public function clientdestroy($id)
    {
        $client = User::where('role', 'client')->find($id);
        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $client->delete();
        return response()->json(['message' => 'Client deleted successfully']);
    }

    //get all allFavorites
public function allFavorites()
{
    try {
        // Avec relations client et food
        $favorites = Favorite::with(['client', 'food'])->get();

        return response()->json($favorites, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur serveur',
            'error' => $e->getMessage()
        ], 500);
    }
}

    
     public function logout(Request $request)
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
