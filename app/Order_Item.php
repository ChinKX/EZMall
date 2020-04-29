<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order_Item extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_id', 'product_id', 'quantity'
    ];

    /**
     * Get the order of this order item
     *
     */
    public function order()
    {
        return $this->belongsTo(order::class);
    }

    /**
     * Get the product of this order item
     *
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
