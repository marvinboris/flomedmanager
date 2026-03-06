<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicament_id',
        'type',
        'quantity',
        'user_id',
    ];

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
