require('./bootstrap');
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home';
import MyCarts from './components/MyCarts';
import Navbar from './components/Navbar';

ReactDOM.render(
  <Router>
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/my-orders">
          <MyCarts />
        </Route>
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
);

// <Router history={browserHistory}>
//     <Route path="/" component={Home} >
//       <Route path="/add-item" component={CreateProduct} />
//       <Route path="/add-item" component={CreateProduct} />
//       <Route path="/display-item" component={DisplayProduct} />
//       <Route path="/edit/:id" component={UpdateProduct} />
//       <Route path="/empty" component={null} key="empty"/>
//     </Route>
//   </Router>