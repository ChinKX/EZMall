<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class StoreResource extends Resource
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
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'merchant' => new UserResource($this->whenLoaded('merchant')),
            'country' => new CountryResource($this->whenLoaded('country')),
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            // 'product_quantity' => $this->whenPivotLoaded('product_store', function () {
            //     return $this->pivot->quantity;
            // }),
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at
        ];
    }
}
