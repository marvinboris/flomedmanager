<?php

namespace App\Exports;

use App\Models\StockMovement;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MovementsExport implements FromCollection, WithHeadings
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = StockMovement::with(['medicament', 'user']);
        
        if ($this->request->start_date) {
            $query->where('created_at', '>=', $this->request->start_date);
        }
        if ($this->request->end_date) {
            $query->where('created_at', '<=', $this->request->end_date);
        }
        
        return $query->orderBy('created_at', 'desc')->get()->map(function ($movement) {
            return [
                'Date' => $movement->created_at,
                'Médicament' => $movement->medicament->name,
                'Type' => $movement->type === 'in' ? 'Entrée' : 'Sortie',
                'Quantité' => $movement->quantity,
                'Utilisateur' => $movement->user->name,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Date',
            'Médicament',
            'Type',
            'Quantité',
            'Utilisateur',
        ];
    }
}
