<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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

    
     public function logout(Request $request)
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
