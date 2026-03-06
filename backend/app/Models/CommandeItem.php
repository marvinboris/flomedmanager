<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommandeItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        'medicament_id',
        'quantity',
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }
}
