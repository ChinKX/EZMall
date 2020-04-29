<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $primaryKey = 'country_code';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'country_code', 'name', 'continent_name'
    ];

    /**
     * Get the stores of this country
     *
     */
    public function stores()
    {
        return $this->hasMany(Store::class, 'country_code', 'country_code');
    }
}
