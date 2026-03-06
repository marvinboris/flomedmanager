<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicament;
use App\Models\Stock;
use Illuminate\Support\Facades\Validator;

class MedicamentController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicament::with('stock');

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('category', 'like', '%' . $request->search . '%');
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $medicaments = $query->orderBy('name')->paginate(10);

        return response()->json($medicaments);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'batch_number' => 'required|string|max:255',
            'expiration_date' => 'required|date|after:today',
            'alert_threshold' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $medicament = Medicament::create($request->all());

        Stock::create([
            'medicament_id' => $medicament->id,
            'quantity' => 0,
        ]);

        return response()->json($medicament->load('stock'), 201);
    }

    public function show(Medicament $medicament)
    {
        return response()->json($medicament->load('stock'));
    }

    public function update(Request $request, Medicament $medicament)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'dosage' => 'sometimes|string|max:255',
            'batch_number' => 'sometimes|string|max:255',
            'expiration_date' => 'sometimes|date',
            'alert_threshold' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $medicament->update($request->all());

        return response()->json($medicament->load('stock'));
    }

    public function destroy(Medicament $medicament)
    {
        $medicament->delete();
        return response()->json(['message' => 'Médicament supprimé']);
    }

    public function categories()
    {
        $categories = Medicament::distinct()->pluck('category');
        return response()->json($categories);
    }

    public function lowStock()
    {
        $medicaments = Medicament::with('stock')
            ->get()
            ->filter(function ($med) {
                return $med->isLowStock();
            });

        return response()->json($medicaments);
    }

    public function expiringSoon()
    {
        $medicaments = Medicament::with('stock')
            ->get()
            ->filter(function ($med) {
                return $med->isExpiringSoon(30);
            });

        return response()->json($medicaments);
    }

    public function expired()
    {
        $medicaments = Medicament::with('stock')
            ->where('expiration_date', '<', now())
            ->get();

        return response()->json($medicaments);
    }
}
