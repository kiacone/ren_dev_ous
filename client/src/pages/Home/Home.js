import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
import { Redirect } from 'react-router-dom'
import Header from "../../components/Header"
import Footer from "../../components/Footer"

import { withStyles } from '@material-ui/core/styles';
import homePageStyle from "../../assets/jss/material-dashboard-react/layouts/home.jsx";
import image from "../../assets/img/sidebar-5.jpg";
// import { Button } from '../../../../node_modules/@material-ui/core';
import Button from "../../components/CustomButtons/Button.jsx";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    };

    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);
    this.onSignUp = this.onSignUp.bind(this)
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app')

    if (obj && obj.token) {
      const { token } = obj

      // Verify token
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

  onTextBoxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }

  onTextBoxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }

  onTextBoxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value
    });
  }

  onTextBoxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value
    });
  }

  onSignUp() {
    
    // Get state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    })

    // Post request to backend
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json)
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: ''
          })
        } else {
          this.setState({
            signUpError: json.message,
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
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

    const { classes } = this.props;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (this.state.toHome === true) {
      return <Redirect to='/signin' />
    }
    
    if (!token) {
      return (

      <div>
        <Header />
        <div className={classes.container} 
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}>
          <div className={classes.introSpace}>
            <div className="row">
              <div className="col s8 white-text">
                <h1 className="introTitle">Built For Developers</h1>
                <h4 className="introText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, expedita commodi cum iusto placeat aliquam aperiam qui eligendi minima voluptate voluptatum adipisci tempora animi eos, optio amet, recusandae facilis soluta corrupti quae vitae. Iste dignissimos aliquam debitis. Quo, exercitationem molestiae.</h4>
              </div>

              <div className="col s4 signUp">
                <div className="card white">
                  <div className="card-content black-text center-align">
                    {
                      (signUpError) ? (
                        <p>{signUpError}</p>
                      ) : (null)
                    }
                    <span className="card-title">Sign Up</span>
                    <input
                    type="text"
                    placeholder="First Name"
                    value={signUpFirstName}
                    onChange={this.onTextBoxChangeSignUpFirstName} />
                    <br /><br />
                    <input
                    type="text"
                    placeholder="Last Name"
                    value={signUpLastName}
                    onChange={this.onTextBoxChangeSignUpLastName} />
                    <br /><br />
                    <input
                    type="email"
                    placeholder="Email"
                    value={signUpEmail}
                    onChange={this.onTextBoxChangeSignUpEmail} />
                    <br /><br />
                    <input
                    type="password"
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={this.onTextBoxChangeSignUpPassword} />
                    <br /><br />
                    <Button className={classes.button} onClick={this.onSignUp}>Sign Up
                      <i class="material-icons right">send</i>
                    </Button>
                  </div>
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

      <Redirect to='/' />

    );
  }
}

// export default Home;
export default withStyles(homePageStyle)(Home);