<?php

namespace App\Exports;

use App\Models\Commande;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CommandesExport implements FromCollection, WithHeadings
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = Commande::with(['fournisseur', 'items.medicament']);
        
        if ($this->request->status) {
            $query->where('status', $this->request->status);
        }
        
        return $query->orderBy('created_at', 'desc')->get()->map(function ($commande) {
            $status = match($commande->status) {
                'pending' => 'En attente',
                'received' => 'Reçue',
                'cancelled' => 'Annulée',
                default => $commande->status,
            };
            
            $items = $commande->items->map(function ($item) {
                return $item->medicament->name . ' (' . $item->quantity . ')';
            })->implode(', ');
            
            return [
                'Date' => $commande->created_at,
                'Fournisseur' => $commande->fournisseur->name,
                'Statut' => $status,
                'Articles' => $items,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Date',
            'Fournisseur',
            'Statut',
            'Articles',
        ];
    }
}
