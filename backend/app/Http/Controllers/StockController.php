<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\Medicament;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Validator;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = Stock::with('medicament');

        if ($request->medicament_id) {
            $query->where('medicament_id', $request->medicament_id);
        }

        $stocks = $query->orderBy('medicament_id')->paginate(10);

        return response()->json($stocks);
    }

    public function show(Stock $stock)
    {
        return response()->json($stock->load('medicament'));
    }

    public function update(Request $request, Stock $stock)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $stock->update(['quantity' => $request->quantity]);

        return response()->json($stock->load('medicament'));
    }

    public function movement(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'medicament_id' => 'required|exists:medicaments,id',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $stock = Stock::firstOrCreate(
            ['medicament_id' => $request->medicament_id],
            ['quantity' => 0]
        );

        if ($request->type === 'out' && $stock->quantity < $request->quantity) {
            return response()->json([
                'message' => 'Stock insuffisant'
            ], 400);
        }

        if ($request->type === 'in') {
            $stock->increment('quantity', $request->quantity);
        } else {
            $stock->decrement('quantity', $request->quantity);
        }

        StockMovement::create([
            'medicament_id' => $request->medicament_id,
            'type' => $request->type,
            'quantity' => $request->quantity,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($stock->load('medicament'));
    }

    public function history(Request $request)
    {
        $query = StockMovement::with(['medicament', 'user']);

        if ($request->medicament_id) {
            $query->where('medicament_id', $request->medicament_id);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $movements = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($movements);
    }
}
