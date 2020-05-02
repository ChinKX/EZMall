import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home';
import MyOrders from './components/MyOrders';
import EditOrder from './components/EditOrder';
import Navbar from './components/Navbar';
import Login from './components/Login';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(isLoggedIn)//!
    return (
      <Router>
        <div>
          {isLoggedIn
            ? <Navbar refresh={() => this.setState({})}/>
            : null
          }
          <Switch>
            <Route exact path="/">
              <Login refresh={() => this.setState({})}/>
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/my-orders">
              <MyOrders />
            </Route>
            <Route path="/edit-order/:id">
              <EditOrder />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;