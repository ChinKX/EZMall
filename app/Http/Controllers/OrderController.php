<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderItemCollection;
use App\Http\Resources\OrderResource;
use App\Order;
use App\OrderItem;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new OrderCollection(Order::with(['customer', 'order_items', 'products'])->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $order = Order::create([
                'customer_id' => $request->input('customer_id'),
                'status' => $request->input('status')
            ]);
            
            foreach($request->input('order_items') as $item) {
                $order->products()->attach($item['product_id'], [
                    'quantity' => $item['quantity']
                ]);
            };

            return new OrderResource($order);
        } catch (QueryException $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 500);
        } catch (Exception $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $order = Order::with(['customer', 'order_items', 'products'])->find($id);
            if(!$order) throw new ModelNotFoundException;

            $product_quantity = array();
            foreach($order->products as $product) {
                array_push($product_quantity, [
                    'product_id' => $product->pivot->product_id,
                    'quantity' => $product->pivot->quantity
                ]);
            }

            // info($product_quantity);

            return response()->json([
                'order' => new OrderResource($order),
                'product_quantity' => $product_quantity
            ]);
        }
        catch(ModelNotFoundException $ex) {
            return response()->json([
                'message' => $ex->getMessage(),
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $order = Order::with(['customer', 'order_items', 'products'])->find($id);
            if(!$order) throw new ModelNotFoundException;

            $order->update([
                'customer_id' => $request->input('customer_id'),
                'status' => $request->input('status')
            ]);

            $order->products()->detach();
            foreach($request->input('order_items') as $item) {
                $order->products()->attach($item['product_id'], [
                    'quantity' => $item['quantity']
                ]);
            };

            return response()->json(null, 204);
        }
        catch(ModelNotFoundException $ex) {
            return response()->json([
                'message' => $ex->getMessage(),
            ], 404);
        }
        catch(QueryException $ex) {
            return response()->json([
                'message' => $ex->getMessage(),
            ], 500);
        }
        catch(Exception $ex) {
            return response()->json([
                'message' => $ex->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $order = Order::with(['customer', 'order_items', 'products'])->findOrFail($id);
            $order->products()->detach();
            $order->delete();

            return 204;
        } catch (ModelNotFoundException $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 404);
        } catch (QueryException $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 500);
        } catch (Exception $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 500);
        }
    }
}
