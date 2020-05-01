import React, { Component } from 'react';
import MyCarts from './MyCarts';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: {},
      product_quantity: [],
      carts: [],
      loading: true,
      // openMyCarts: false
    }
  }

  getData() {
    axios.get('http://localhost:8000/api/stores/1')
      .then(response => {
        this.setState({
          store: response.data.store,
          product_quantity: response.data.product_quantity,
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

  render() {
    console.log('home')//!
    console.log(this.state.carts)//!
    console.log(this.state.product_quantity)//!
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
          onClick={() => this.addToCart(product.id)} className="btn btn-primary" type="submit">Add To Cart</button>
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

export default Home;