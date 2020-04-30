<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'customer_id', 'status'
    ];

    /**
     * Get the customer who issued this order
     *
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the order items belong to this order
     *
     */
    public function order_items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the products related to this order
     *
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items')->withPivot('quantity');
    }
}
