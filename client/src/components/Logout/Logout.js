import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
} from '../../utils/storage';
import { Redirect } from 'react-router-dom'

import CustomButtons from "../../components/CustomButtons/Button.jsx";

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      toHome: false,
      token: '',
      dashboard: ''
    };

    this.logout = this.logout.bind(this)
    // console.log(this)
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app')

    if (obj && obj.token) {
      const { token } = obj
      // verify token
      fetch('/api/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              // could also be token: token
              isLoading: false,
            })
          } else {
            this.setState({
              isLoading: false,
            })
          }
        });
    } else {
      this.setState({
        isLoading: false,
      })

    }
  }

  logout() {
    this.setState({
      isLoading: true,
    })
    const obj = getFromStorage('the_main_app')

    if (obj && obj.token) {
      const { token } = obj
      // verify token
      fetch('/api/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              signInError: '',
              // could also be token: token
              isLoading: false,
              toHome: true,
            })
          } else {
            this.setState({
              isLoading: false,
              signInError: '',
            })
          }
        });
    } else {
      this.setState({
        isLoading: false,
        signInError: '',
        toHome: true,
      })
    }
  }

  render() {
    const {
      isLoading,
      token,
      // uniqueId
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (this.state.toHome === true) {
      return <Redirect to='/' />
    }

    if (token) {

      return (
        <CustomButtons color='primary' onClick={this.logout}>
          Logout
        </CustomButtons>
      )

    }
    
    return (
      "There is NOT a token."
    )
  }
}

export default Logout;