<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Food;


class ClientController extends Controller
{
    // Register client
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $client = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
        ]);

        $token = $client->createToken('client-token')->plainTextToken;

        return response()->json([
            'message' => 'Client registered successfully',
            'client' => $client,
            'token' => $token
        ], 201);
    }

    // Login client
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $client = User::where('email', $request->email)
                      ->where('role', 'client')
                      ->first();

        if (!$client || !Hash::check($request->password, $client->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $client->createToken('client-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'client' => $client,
            'token' => $token
        ]);
    }


    //profile 
    public function profile(Request $request)
{
    return response()->json([
        'client' => $request->user()
    ]);
}


//dashboard
public function dashboard(Request $request) {
    $client = $request->user(); 
    $foods = Food::get(); 

    return response()->json([
        'client' => $client,
        'foods' => $foods,
    ]);
}

  // Logout client
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }
}
