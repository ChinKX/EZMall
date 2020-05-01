import React, { Component } from "react";
import { Dialog, IconButton } from "@material-ui/core";
import { Close } from '@material-ui/icons';
import axios from 'axios';

class  MyCarts extends Component {
  render() {
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
                <p><b>Item {i + 1}</b></p>
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
              <button className="btn btn-primary m-2" onClick={() => {
                // Create new order
                axios.post('http://localhost:8000/api/orders', )

                this.props.closeMyCarts();
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