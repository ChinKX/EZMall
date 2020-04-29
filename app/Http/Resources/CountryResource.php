<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class CountryResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'country_code' => $this->country_code,
            'name' => $this->name,
            'continent_name' => $this->continent_name,
            'stores' => new StoreCollection($this->whenLoaded('stores')),
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at
        ];
    }
}
