import React, { Component } from "react";
import { Dialog, IconButton } from "@material-ui/core";
import { Close } from '@material-ui/icons';
import axios from 'axios';

class MyCarts extends Component {
  render() {
    console.log(this.props.product_quantity)//!
    return (
      <Dialog open={true} maxWidth='md' fullWidth>
        <div className="container p-3">
          <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr'}}>
            <h3>My Carts</h3>
            <IconButton onClick={this.props.closeMyCarts} style={{justifySelf: 'end'}}>
              <Close />
            </IconButton>
          </div>
          {this.props.carts.map((cart, i) => {
            const product = this.props.store.products.find(product => product.id === cart.product_id);

            return (
              <div className="card col-md-3 m-3 p-3" key={i}>
                <h5>Item {i + 1}</h5>
                <p><b>Product Name: {product.name}</b></p>
                <p><b>Quantity: {cart.quantity}</b></p>
                <p><b>Price: ${product.price}</b></p>
              </div>
            )
          })}
        </div>
        <div className="container mt-1 p-2 align-items-center">
          <h4 className="col-md-8">Total: ${this.props.carts.reduce((result, cart) => {
            const product = this.props.store.products.find(product => product.id === cart.product_id);
            return result + (cart.quantity * product.price);
          }, 0)}</h4>
          <div className="col-md-4">
            <div className="row justify-content-end">
              <button className="btn btn-danger m-2" onClick={this.props.resetCarts}>
                Reset
              </button>
              <button className="btn btn-primary m-2" onClick={async () => {
                // Create new order & update stocks
                try {
                  // console.log(this.props.store)//!
                  // console.log(this.props.product_quantity)//!
                  // console.log({
                  //   name: this.props.store.name,
                  //   description: this.props.store.description,
                  //   merchant_id: this.props.store.merchant_id,
                  //   country_code: this.props.store.country.country_code,
                  //   products: this.props.product_quantity.map(
                  //     p_q => ({
                  //       id: p_q.product_id,
                  //       quantity: p_q.quantity
                  //     })
                  //   )
                  // })//!
                  await Promise.all([
                    axios.post(
                      'http://localhost:8000/api/orders', {
                      customer_id: 2,
                      store_id: 1,
                      status: 'processing',
                      order_items: this.props.carts
                    }),
                    axios.put(
                      'http://localhost:8000/api/stores/' + '1',
                      {
                        name: this.props.store.name,
                        description: this.props.store.description,
                        merchant_id: this.props.store.merchant.id,
                        country_code: this.props.store.country.country_code,
                        products: this.props.product_quantity.map(
                          p_q => ({
                            id: p_q.product_id,
                            quantity: p_q.quantity
                          })
                        )
                      }
                    )
                  ]).then(_ => {
                    this.props.refreshData();
                    this.props.resetCarts();
                    this.props.closeMyCarts();
                  })
                } catch(error) {
                  console.log(error);
                }
              }}>
                Buy
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default MyCarts;