<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'fournisseur_id',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function items()
    {
        return $this->hasMany(CommandeItem::class);
    }
}
