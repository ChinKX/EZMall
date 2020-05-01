<?php

namespace App\Http\Controllers;

use App\Http\Resources\StoreCollection;
use App\Http\Resources\StoreResource;
use App\Store;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $stores = Store::with(['merchant', 'country', 'products'])->get();
        // foreach($stores as $store) {
        //     info('entered');
        //     foreach($store->products as $product) {
        //         info($product->pivot->product_id);
        //         info($product->pivot->quantity);
        //     }
        // }

        return new StoreCollection(Store::with(['merchant', 'country', 'products', 'orders'])->get());
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
            $store = Store::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'merchant_id' => $request->input('merchant_id'),
                'country_code' => $request->input('country_code')
            ]);

            foreach($request->input('products') as $product) {
                $store->products()->attach($product['id'], [
                    'quantity' => $product['quantity']
                ]);
            }

            return new StoreResource($store);
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
            $store = Store::with(['merchant', 'country', 'products', 'orders'])->find($id);
            if(!$store) throw new ModelNotFoundException;

            $product_quantity = array();
            foreach($store->products as $product) {
                array_push($product_quantity, [
                    'product_id' => $product->pivot->product_id,
                    'quantity' => $product->pivot->quantity
                ]);
            }

            // info($product_quantity);

            return response()->json([
                'store' => new StoreResource($store),
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
            $store = Store::with('products')->find($id);
            if(!$store) throw new ModelNotFoundException;

            $store->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'merchant_id' => $request->input('merchant_id'),
                'country_code' => $request->input('country_code')
            ]);

            $store->products()->detach();
            foreach($request->input('products') as $product) {
                $store->products()->attach($product['id'], [
                    'quantity' => $product['quantity']
                ]);
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
            $store = Store::with('products')->findOrFail($id);
            $store->products()->detach();
            $store->delete();

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
