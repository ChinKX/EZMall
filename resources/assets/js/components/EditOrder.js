import React, { Component } from 'react';
import MyCarts from './MyCarts';
import {
  withRouter
} from 'react-router-dom';

class EditOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: {},
      product_quantity: [],
      carts: [],
      loading: true,
      openMyCarts: false
    }
  }

  getData() {
    Promise.all([
      axios.get('http://localhost:8000/api/stores/1'),
      axios.get('http://localhost:8000/api/orders/' + this.props.match.params.id)
    ])
      .then(([storeResponse, orderResponse]) => {
        this.setState({
          store: storeResponse.data.store,
          product_quantity: storeResponse.data.product_quantity,
          carts: orderResponse.data.order.order_items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity
          })),
          loading: false
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  componentDidMount() {
    this.getData();
  }

  addToCart(id) {
    const existingCart = this.state.carts.find(cart => cart.product_id === id);
    const product_quantity_to_update = this.state.product_quantity.find(p_q => p_q.product_id === id);
    if (!existingCart) {
      this.setState({
        ...this.state,
        carts: [
          ...this.state.carts, {
          product_id: id,
          quantity: 1
        }],
        product_quantity: [
          ...this.state.product_quantity.filter(p_q => p_q.product_id != id),
          {
            ...product_quantity_to_update,
            quantity: product_quantity_to_update.quantity - 1
          }
        ]
      });
    } else {
      this.setState({
        ...this.state,
        carts: [
          ...this.state.carts.filter(cart => cart.product_id != id),
          {
            ...existingCart,
            quantity: existingCart.quantity + 1
          }
        ],
        product_quantity: [
          ...this.state.product_quantity.filter(p_q => p_q.product_id != id),
          {
            ...product_quantity_to_update,
            quantity: product_quantity_to_update.quantity - 1
          }
        ]
      });
    }
  }

  removeFromCart(id) {
    const existingCart = this.state.carts.find(cart => cart.product_id === id);
    const product_quantity_to_update = this.state.product_quantity.find(p_q => p_q.product_id === id);
    if (existingCart) {
      if (existingCart.quantity === 1) {
        this.setState({
          ...this.state,
          carts: this.state.carts.filter(cart => cart.product_id != existingCart.product_id),
          product_quantity: [
            ...this.state.product_quantity.filter(p_q => p_q.product_id != id),
            {
              ...product_quantity_to_update,
              quantity: product_quantity_to_update.quantity + 1
            }
          ]
        });
      } else {
        this.setState({
          ...this.state,
          carts: [
            ...this.state.carts.filter(cart => cart.product_id != id),
            {
              ...existingCart,
              quantity: existingCart.quantity - 1
            }
          ],
          product_quantity: [
            ...this.state.product_quantity.filter(p_q => p_q.product_id != id),
            {
              ...product_quantity_to_update,
              quantity: product_quantity_to_update.quantity + 1
            }
          ]
        });
      }
    }
  }

  render() {
    if (this.state.loading) {
      return <div></div>;
    }

    const productList = (this.state.store.products || []).map((product, i) => (
      <div className="card col-md-3 m-3 p-3" key={i}>
        <div className="d-flex flex-column">
          <img className="card-img-top" src={require("../images/product.png")}/>
          <h4>{product.name}</h4>
        </div>
        <div className="card-body">
          <p>{product.description}</p>
          <p><b>Stock Available: {this.state.product_quantity.find(p_q => p_q.product_id === product.id).quantity}</b></p>
          <p><b>Price: ${product.price}</b></p>
        </div>
        <button
          disabled={this.state.product_quantity.find(p_q => p_q.product_id === product.id).quantity <= 0}
          onClick={() => {
            this.addToCart(product.id)
          }} className="btn btn-primary"
        >
          Add To Cart
        </button>
        <button
          disabled={this.state.carts.findIndex(cart => cart.product_id === product.id) === -1}
          onClick={() => {
            this.removeFromCart(product.id)
          }} className="btn btn-primary"
        >
          Remove From Cart
        </button>
      </div>
    ));

    return (
      <div>
        <div className="container mt-5">
          <div>
            <h3>Shop Name: {this.state.store.name || ''}</h3>
            <h4>Description: {this.state.store.description || ''}</h4>
            <h4>Country: {(this.state.store.country || {name: ''}).name}</h4>
          </div>
          <div>
            {productList}
          </div>
        </div>
        <div className="container mt-5 justify-content-center">
          <button
            className="btn btn-primary"
            disabled={this.state.carts.length <= 0}
            onClick={() => this.setState({...this.state, openMyCarts: true})}
          >
              My Carts
          </button>
          {
            this.state.openMyCarts &&
            <MyCarts
              createOrder={false}
              orderId={this.props.match.params.id}
              store={this.state.store}
              product_quantity={this.state.product_quantity}
              carts={this.state.carts}
              closeMyCarts={() => this.setState({...this.state, openMyCarts: false})}
              resetCarts={() => {
                this.getData();
                this.setState({
                  ...this.state,
                  carts: [],
                  loading: true,
                  openMyCarts: false
                })
              }}
              refreshData={() => this.getData()}
            />
          }
        </div>
      </div>
    );
  }
}

export default withRouter(EditOrder);