<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\CommandeItem;
use App\Models\Stock;
use Illuminate\Support\Facades\Validator;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        $query = Commande::with(['fournisseur', 'items.medicament']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $commandes = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($commandes);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'items' => 'required|array|min:1',
            'items.*.medicament_id' => 'required|exists:medicaments,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $commande = Commande::create([
            'fournisseur_id' => $request->fournisseur_id,
            'status' => 'pending',
        ]);

        foreach ($request->items as $item) {
            CommandeItem::create([
                'commande_id' => $commande->id,
                'medicament_id' => $item['medicament_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json($commande->load(['fournisseur', 'items.medicament']), 201);
    }

    public function show(Commande $commande)
    {
        return response()->json($commande->load(['fournisseur', 'items.medicament']));
    }

    public function update(Request $request, Commande $commande)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:pending,received,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->status === 'received' && $commande->status !== 'received') {
            foreach ($commande->items as $item) {
                $stock = Stock::firstOrCreate(
                    ['medicament_id' => $item->medicament_id],
                    ['quantity' => 0]
                );
                $stock->increment('quantity', $item->quantity);
            }
        }

        $commande->update($request->only(['status']));

        return response()->json($commande->load(['fournisseur', 'items.medicament']));
    }

    public function destroy(Commande $commande)
    {
        $commande->delete();
        return response()->json(['message' => 'Commande supprimée']);
    }
}
