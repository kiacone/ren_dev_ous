import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
import { Redirect } from 'react-router-dom'
import Footer from "../../components/Footer";
import Header from "../../components/Header";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      toDashboard: false,
      addLink: '',
      results: [],
      appendArticles: []
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
          setInStorage('the_main_app', { token: json.token })
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
            toDashboard: true
          })
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          })
        }
      })
      this.renderArticles();
  }

  renderArticles() {
    fetch('/api/appendarticle', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json) {
          console.log("success")
          this.setState({ appendArticles: json })
          console.log(this.state)
        } else {
          this.setState({
            // signUpError: json.message,
            isLoading: false,
          })
        }
      })
    console.log("articles: ", this.state)
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      // uniqueId
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (this.state.toDashboard === true) {
      return <Redirect to='/dashboard' />
    }

    if (!token) {

      return (
        <div>
        <Header/>
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
          <Footer/>
          </div>
      )

    }
    
    return (
      "There is a token."
    )
  }
}

export default Home;