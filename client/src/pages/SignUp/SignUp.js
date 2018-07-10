import React, { Component } from 'react';
import 'whatwg-fetch';
import { getFromStorage } from '../../utils/storage';
import { Redirect } from 'react-router-dom'

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      toHome: false,
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
    // grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    })

    // post request to backend
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
            signUpLastName: '',
            toHome: true,
          })
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            toHome: true,
          })
        }
      })
  }

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

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (this.state.toHome === true) {
      return <Redirect to='/' />
    }

    return (
    <div className='container'>
      <div className="row">
        <div className="col s12">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
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
              <button className='btn' onClick={this.onSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default SignUp;