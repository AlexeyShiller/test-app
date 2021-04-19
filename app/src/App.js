import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import AuthService from './services/auth.service'

import Login from './components/login.component'
import Register from './components/register.component'
import Table from './components/table.component'

class App extends Component {
  constructor (props) {
    super(props)
    this.logOut = this.logOut.bind(this)

    this.state = {
      showAdminBoard: false,
      currentUser: undefined
    }
  }

  componentDidMount () {
    const user = AuthService.getCurrentUser()

    if (user) {
      this.setState({
        currentUser: user
      })
    }
  }

  logOut () {
    AuthService.logout()
  }

  render () {
    const { currentUser } = this.state

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">
            {currentUser && (
              <li className="nav-item">
                <Link to={'/'} className="nav-link">
                  Table
                </Link>
              </li>
            )}
          </div>

          {currentUser
            ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item d-flex align-items-center">
                <h5 className="text-light mr-3 mb-0">
                  {this.state.currentUser.username}
                </h5>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
              )
            : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/login'} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={'/register'} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
              )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={'/'} component={() => <Table redirect={!currentUser} user={currentUser} />} />
            <Route exact path="/login" component={() => <Login redirect={currentUser} />} />
            <Route exact path="/register" component={() => <Register redirect={currentUser} />} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
