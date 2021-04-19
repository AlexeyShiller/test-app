import React, { Component } from 'react'
import DataTable from 'react-data-table-component'

import { Redirect } from 'react-router-dom'

import AuthService from '../services/auth.service'
import UserService from '../services/user.service'

const columns = [
  {
    name: 'Id',
    selector: '_id',
    sortable: true
  },
  {
    name: 'Username',
    selector: 'username',
    sortable: true
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true
  },
  {
    name: 'Registration date',
    selector: 'createdAt',
    sortable: true
  },
  {
    name: 'Date last login',
    selector: 'lastLogin',
    sortable: true
  },
  {
    name: 'Status',
    selector: row => row.isMuted ? '🔒' : 'Normal',
    sortable: true
  }
]

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: [],
      redirect: this.props.redirect,
      user: this.props.user,
      selectedRows: [],
      toggleCleared: false
    }
  }

  componentDidMount () {
    const user = AuthService.getCurrentUser()
    this.setState({ user })

    this.updateData()
  }

  updateData () {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          data: response.data
        })
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        })
      }
    )
  }

  handleChange (state) {
    this.setState({ selectedRows: state.selectedRows })
  };

  handleRemove () {
    this.state.selectedRows.forEach(item => {
      const id = item._id
      UserService.deleteUser(id)
        .then((response) => {
          const mutedUserId = response.data.id

          if (this.state.user.id === mutedUserId) {
            AuthService.logout()
            window.location.reload()
          }

          this.updateData()
          this.setState({ toggleCleared: !this.state.toggleCleared })
        })
    })
  }

  handleMute () {
    this.state.selectedRows.forEach(item => {
      const id = item._id
      UserService.muteUser(id)
        .then((response) => {
          const mutedUserId = response.data.id

          if (this.state.user.id === mutedUserId) {
            AuthService.logout()
            window.location.reload()
          }

          this.updateData()
          this.setState({ toggleCleared: !this.state.toggleCleared })
        })
    })
  }

  renderActions () {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-warning mr-2" onClick={this.handleMute.bind(this)}>
          🔒
        </button>
        <button type="button" className="btn btn-danger" onClick={this.handleRemove.bind(this)}>
          🗑
        </button>
      </React.Fragment>
    )
  }

  render () {
    if (this.state.redirect) {
      return <Redirect to={'/register'} />
    }

    return (
      <div className="container">
        <DataTable
          title="Users"
          columns={columns}
          data={this.state.data}
          keyField="_id"
          selectableRowsHighlight={true}
          selectableRows
          onSelectedRowsChange={this.handleChange.bind(this)}
          clearSelectedRows={this.state.toggleCleared}
          contextActions={this.renderActions()}
        />
      </div>
    )
  }
}
