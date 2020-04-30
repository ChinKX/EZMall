<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'merchant_id', 'country_code'
    ];

    /**
     * Get the country of this store
     *
     */
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_code', 'country_code');
    }

    /**
     * Get the merchant of this store
     *
     */
    public function merchant()
    {
        return $this->belongsTo(User::class, 'merchant_id');
    }

    /**
     * Get the products of this store
     *
     */
    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('quantity');
    }
}
