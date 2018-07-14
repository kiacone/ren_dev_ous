import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
import { Redirect } from 'react-router-dom'
import Header from "../../components/Header/Header.jsx"

// **************** DANGER ZONE *********************************************
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";
import People from "@material-ui/icons/People";
// core components
// import Header from "../../components/Header/Header.jsx";
import HeaderLinks from "../../components/Header/HeaderLinks.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";

import loginPageStyle from "../../assets/jss/material-kit-react/views/loginPage.jsx";

import image from "../../assets/img/bg7.jpg";
// **************** END OF DANGER ZONE ***************************************

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      cardAnimaton: "cardHidden"
    };

    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this)
  }
  componentDidMount() {
    
  }
  componentDidMount() {
    const obj = getFromStorage('the_main_app')

    // ********** Card Animation **********
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    // FIXME: May need to integrate into below logic..
    // **********************
    
    if (obj && obj.token) {
      const { token } = obj
      // verify token
      fetch('/api/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
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

  onTextBoxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }

  onTextBoxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }

  onSignIn() {
    // post request to backend
    // grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    })

    // post request to backend
    fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json)
        if (json.success) {
          console.log(json)
          setInStorage('the_main_app', { token: json.token })
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
            userId: json.userId
          })
          this.props.history.push('/dashboard/' + json.userId)

        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          })
        }
      })
  }

  // Display page
  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      classes, 
      ...rest
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }
    
    if (!token) {
      return (
        <div>
          <Header />

        <div className='container'>
          <div className="row">
            <div className="col s12">
              <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                  {
                    (signInError) ? (
                      <p>{signInError}</p>
                    ) : (null)
                  }
                  <span className="card-title">Sign In</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={signInEmail}
                    onChange={this.onTextBoxChangeSignInEmail} />
                  <br /><br />
                  <input
                    type="password"
                    placeholder="Password"
                    value={signInPassword}
                    onChange={this.onTextBoxChangeSignInPassword} />
                  <br /><br />
                  <button className='btn' onClick={this.onSignIn}>Sign In</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      )
    }

    return (

      <Redirect to='/signin' />

    );
  }
}

export default withStyles(loginPageStyle)(SignIn);