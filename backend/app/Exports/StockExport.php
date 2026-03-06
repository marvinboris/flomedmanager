<?php

namespace App\Exports;

use App\Models\Stock;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StockExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Stock::with('medicament')->get()->map(function ($stock) {
            return [
                'Médicament' => $stock->medicament->name,
                'Catégorie' => $stock->medicament->category,
                'Dosage' => $stock->medicament->dosage,
                'Numéro de lot' => $stock->medicament->batch_number,
                'Date d\'expiration' => $stock->medicament->expiration_date,
                'Quantité' => $stock->quantity,
                'Seuil d\'alerte' => $stock->medicament->alert_threshold,
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
            'Seuil d\'alerte',
        ];
    }
}
