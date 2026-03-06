<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'dosage',
        'batch_number',
        'expiration_date',
        'alert_threshold',
    ];

    protected $casts = [
        'expiration_date' => 'date',
    ];

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function commandeItems()
    {
        return $this->hasMany(CommandeItem::class);
    }

    public function isExpiringSoon($days = 30)
    {
        return $this->expiration_date && 
               $this->expiration_date->diffInDays(now()) <= $days;
    }

    public function isExpired()
    {
        return $this->expiration_date && 
               $this->expiration_date->isPast();
    }

    public function isLowStock()
    {
        return $this->stock && 
               $this->stock->quantity <= $this->alert_threshold;
    }
}
