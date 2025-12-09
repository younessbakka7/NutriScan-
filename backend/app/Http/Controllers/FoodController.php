<?php
namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FoodController extends Controller
{
    public function index()
    {
        return response()->json(Food::all(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'calories' => 'nullable|numeric',
            'sugar' => 'nullable|numeric',
            'fat' => 'nullable|numeric',
            'protein' => 'nullable|numeric',
            'salt' => 'nullable|numeric',
            'description' => 'nullable|string',
           // 'image' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',


            'barcode' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
          $path = $request->file('image')->store('foods', 'public');
          $data['image'] = Storage::url($path);
        }


        $grade = $this->calculateGrade($data['sugar'] ?? null, $data['fat'] ?? null);
        $data['grade'] = $grade;

        $food = Food::create($data);

        return response()->json($food, 201);
    }

    private function calculateGrade($sugar, $fat)
    {
        if (!is_null($sugar) && !is_null($fat)) {
            if ($sugar <= 5 && $fat <= 3) return "A";
            if ($sugar <= 10 && $fat <= 10) return "B";
            if ($sugar <= 20) return "C";
            if ($sugar <= 30) return "D";
        }
        return "E";
    }

    public function show($id)
    {
        $food = Food::find($id);
        if (!$food) {
            return response()->json(['message' => 'Food not found'], 404);
        }
        return response()->json($food, 200);
    }

    public function update(Request $request, $id)
    {
        $food = Food::find($id);
        if (!$food) {
            return response()->json(['message' => 'Food not found'], 404);
        }

        $data = $request->only([
            'name','calories','sugar','fat','protein','salt',
            'description','image','barcode'
        ]);

        if ($request->hasFile('image')) {
    $path = $request->file('image')->store('foods', 'public');
    $data['image'] = Storage::url($path);
}


        if (isset($data['sugar']) || isset($data['fat'])) {
            $data['grade'] = $this->calculateGrade($data['sugar'] ?? $food->sugar, $data['fat'] ?? $food->fat);
        }

        $food->update($data);
        return response()->json($food, 200);
    }

    public function destroy($id)
    {
        $food = Food::find($id);
        if (!$food) {
            return response()->json(['message' => 'Food not found'], 404);
        }
        $food->delete();
        return response()->json(['message' => 'Food deleted'], 200);
    }
}
