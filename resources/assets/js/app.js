require('./bootstrap');
// require('./globals');
import './globals';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './main';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);