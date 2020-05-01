import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    }
  }

  getData() {
    axios.get('http://localhost:8000/api/orders?customerId=2')
      .then(response => {
        this.setState({
          orders: response.data.data
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  componentDidMount() {
    this.getData();
  }

  itemList(order_items) {
    return (order_items || []).map((item, i) => (
      <div className="card col-md-3 m-3 p-4" key={i}>
        <h4>{item.product.name}</h4>
        <div className="card-body">
          <p>{item.product.description}</p>
          <p><b>Quantity ordered: {item.quantity}</b></p>
          <p><b>Price: ${item.product.price}</b></p>
        </div>
      </div>
    ));
  }

  render() {
    if (this.state.loading) {
      return <div></div>;
    }

    return (
      <div className="container mt-5 justify-content-center">
        {this.state.orders.map((order, i) => {
          return (
            <div className="container mt-5" key={i}>
              <div>
                <h3>Order {i + 1}</h3>
                <h5>Shop Name: {order.store.name || ''}</h5>
                <h5>Status: {order.status || ''}</h5>
              </div>
              <div>
                <Link to={"/edit-order/"+order.id} className="btn btn-danger">Edit</Link>
                <button
                  disabled={(order.status || '') === 'accepted'}
                  onClick={() => {
                    console.log('http://localhost:8000/api/orders/' + order.id);//!
                    axios.delete('http://localhost:8000/api/orders/' + order.id)
                      .then(_ => this.getData())
                  }}
                  className="btn btn-primary m-3"
                >
                  Delete
                </button>
              </div>
              <div>
                {this.itemList(order.order_items)}
              </div>
            </div>
          );
        })}
        
        
        {/* <div className="container mt-5 justify-content-center">
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
        </div> */}
      </div>
    );
  }
}

export default MyOrders;