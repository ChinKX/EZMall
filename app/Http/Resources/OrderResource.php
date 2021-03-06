<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class OrderResource extends Resource
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
            'customer' => new UserResource($this->whenLoaded('customer')),
            'store' => new StoreResource($this->whenLoaded('store')),
            'status' => $this->status,
            'order_items' => OrderItemResource::collection($this->whenLoaded('order_items')),
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at
        ];
    }
}
