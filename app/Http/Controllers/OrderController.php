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
        return new OrderCollection(Order::with(['customer', 'order_items'])->get());
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

            $parsed_order_items = json_decode($request->input('order_items'), true);

            $order_items = array();

            foreach($parsed_order_items as $item) {
                array_push($order_items, OrderItem::create([
                    'order_id' => $item['order_id'],
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity']
                ]));
            };

            return response()->json([
                'order' => new OrderResource($order),
                'order_items' => new OrderItemCollection($order_items)
            ]);
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
            $order = Order::with(['customer', 'order_items'])->find($id);
            if(!$order) throw new ModelNotFoundException;

            return new OrderResource($order);
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
            $order = Order::with(['customer', 'order_items'])->find($id);
            if(!$order) throw new ModelNotFoundException;

            $parsed_order_items = json_decode($request->input('order_items'), true);
            $order_items = $order->order_items;
            $validIds = array();

            // Update the related order items
            foreach($parsed_order_items as $item) {
                array_push($validIds, $item['id']);
                $itemToUpdate = $order_items->find($item['id']);
                $itemToUpdate->fill([
                    'order_id' => $item['order_id'],
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity']
                ]);
                $itemToUpdate->saveOrFail();
            }

            // Delete the unrelated order items
            foreach($order_items as $item) {
                if (!in_array($item->id, $validIds)) {
                    $item->delete();
                }
            }

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
            $order = Order::with('order_items')->findOrFail($id);
            $order_items = $order->order_items;
            foreach($order_items as $item) {
                $item->delete();
            }
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
