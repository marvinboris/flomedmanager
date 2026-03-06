<?php

namespace App\Exports;

use App\Models\Medicament;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ExpiredMedicamentsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Medicament::with('stock')
            ->where('expiration_date', '<', now())
            ->get()
            ->map(function ($med) {
                return [
                    'Médicament' => $med->name,
                    'Catégorie' => $med->category,
                    'Dosage' => $med->dosage,
                    'Numéro de lot' => $med->batch_number,
                    'Date d\'expiration' => $med->expiration_date,
                    'Quantité' => $med->stock ? $med->stock->quantity : 0,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Médicament',
            'Catégorie',
            'Dosage',
            'Numéro de lot',
            'Date d\'expiration',
            'Quantité',
        ];
    }
}
