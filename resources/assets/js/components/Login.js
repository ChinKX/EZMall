import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch } from '@material-ui/core';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      error: ''
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: '' });
  }

  login(evt) {
    evt.preventDefault();

    if (!this.state.email) {
      return this.setState({ error: 'Email is required' });
    }

    if (!this.state.password) {
      return this.setState({ error: 'Password is required' });
    }

    axios.post('http://localhost:8000/api/auth/login', {
      "email": this.state.email,
      "password": this.state.password
    }).then(response => {
      console.log(response);//!
      setIsLoggedIn(true);
      setToken(response.data.access_token);
      console.log(isLoggedIn);//!
      console.log(token);//!
      window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      this.props.refresh();
      this.props.history.push('/home');
    });
    
    // return this.setState({ error: '' });
  }

  signup(evt) {
    evt.preventDefault();

    if (!this.state.username) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.email) {
      return this.setState({ error: 'Email is required' });
    }

    if (!this.state.password) {
      return this.setState({ error: 'Password is required' });
    }

    axios.post('http://localhost:8000/api/register', {
      "name": this.state.username,
      "email": this.state.email,
      "password": this.state.password,
      "role": "customer"
    }).then(_ => this.setState({ error: 'Registered Successfully!' }));
  }

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  };

  handleEmailChange(evt) {
    this.setState({
      email: evt.target.value,
    });
  };

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  handleSwitchChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.checked
    });
  };

  render() {
    // NOTE: I use data-attributes for easier E2E testing
    // but you don't need to target those (any css-selector will work)

    return (
      <div className="container">
        {
          !this.state.loginOrSignup
            ? <form onSubmit={this.login}>
            <div className="form-group">
              {
                this.state.error &&
                <h3 data-test="error" onClick={this.dismissError}>
                  <button onClick={this.dismissError}>✖</button>
                  {this.state.error}
                </h3>
              }
              <label>Email</label>
              <input type="text" className="form-control" data-test="email" value={this.state.email} onChange={this.handleEmailChange} />
  
              <label>Password</label>
              <input type="password" className="form-control" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
  
              <input className="btn btn-primary" type="submit" value="Log In" data-test="submit" />
            </div>
          </form>
          : <form onSubmit={this.signup}>
            <div className="form-group">
              {
                this.state.error &&
                <h3 data-test="error" onClick={this.dismissError}>
                  <button onClick={this.dismissError}>✖</button>
                  {this.state.error}
                </h3>
              }
              <label>User Name</label>
              <input type="text" className="form-control" data-test="username" value={this.state.username} onChange={this.handleUserChange} />
  
              <label>Email</label>
              <input type="text" className="form-control" data-test="username" value={this.state.email} onChange={this.handleEmailChange} />
  
              <label>Password</label>
              <input type="password" className="form-control" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
  
              <input className="btn btn-primary" type="submit" value="Sign Up" data-test="submit" />
            </div>
          </form>
        }
        <Switch
          checked={this.state.loginOrSignup}
          onChange={this.handleSwitchChange}
          color="primary"
          name="loginOrSignup"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </div>
    );
  }
}

export default withRouter(Login);