<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'type', 'price', 'quantity', 'status'
    ];

    /**
     * Get the order items related to this product
     *
     */
    public function order_items()
    {
        return $this->hasMany(Order_Item::class);
    }

    /**
     * Get the stores which sell this product
     *
     */
    public function stores()
    {
        return $this->belongsToMany(Store::class);
    }
}
