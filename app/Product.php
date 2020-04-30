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
        'name', 'description', 'type', 'price', 'status'
    ];

    /**
     * Get the order items related to this product
     *
     */
    public function order_items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the stores which sell this product
     *
     */
    public function stores()
    {
        return $this->belongsToMany(Store::class)->withPivot('quantity');
    }

    /**
     * Get the orders related to this product
     *
     */
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_items')->withPivot('quantity');
    }
}
