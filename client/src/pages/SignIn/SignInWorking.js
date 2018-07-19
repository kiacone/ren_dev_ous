import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
// import { Redirect } from 'react-router-dom'
import Header from "../../components/Header";
import { withStyles } from '@material-ui/core/styles';
import logo from "../../assets/img/rdv_logo.png";
import Button from "../../components/CustomButtons/Button.jsx";
import signInStyle from "../../assets/jss/material-dashboard-react/layouts/signIn.jsx";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      
    };

    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this)
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
      signInPassword
    } = this.state;

    const { classes, ...rest } = this.props;
    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }
    
    if (!token) {
      return (
        <div>
          <Header
          color="transparent"
          logo={logo}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />
        <div className='valign-wrapper'>
        <div className={classes.container}>
          <div className="row">
            <div className="col s12">
              <div className="card white">
                <div className="card-content black-text center-align">
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
                  {/* <button className='btn' onClick={this.onSignIn}>Sign In</button> */}
                  <Button className={classes.button} onClick={this.onSignIn}>Sign In
                      <i class="material-icons right">send</i>
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        </div>
      )
    }

    return (

      // <Redirect to='/signin' />
      <h1>some text</h1>

    );
  }
}

// export default SignIn;
export default withStyles(signInStyle)(SignIn);