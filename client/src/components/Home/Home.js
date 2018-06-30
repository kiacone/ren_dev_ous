import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';

// const cheerio = require('react-native-cheerio')

const cheerio = require("cheerio");
const request = require("request");


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      // split into different components?
      token: '',
      // split into different components?
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
      dashboad: '',
      addLink: '',
      results: []

    };
    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);

    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);

    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);

    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);

    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);

    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);

    this.onTextBoxChangeAddLink = this.onTextBoxChangeAddLink.bind(this);

    this.onSignIn = this.onSignIn.bind(this)
    this.onSignUp = this.onSignUp.bind(this)
    this.onAddLink = this.onAddLink.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app')

    if (obj && obj.token) {
      const { token } = obj
      // verify token
      fetch('/api/account/verify?token=' + token)
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

  onTextBoxChangeAddLink(event) {
    this.setState({
      addLink: event.target.value

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
    fetch('/api/account/signup', {
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
          })
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          })
        }
      })
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
    fetch('/api/account/signin', {
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
          })
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          })
        }
      })
  }

  onAddLink() {
    // grab state
    const {
      addLink,
      token,
      results
    } = this.state;

    

    
    // var cheerio = require("cheerio");
    // var request = require("request");
    
    var article = addLink
    console.log("the article is: ", article)
    
    // Make a request call to grab the HTML body from the site of your choice
    request("https://cors-anywhere.herokuapp.com/" + article, function(error, response, html) {
    
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);
    
      // An empty array to save the data that we'll scrape
    
      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("head").each(function(i, body) {
    
        var $ = cheerio.load(body);
        var title = $("title").text();
    
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title
        });
      });
    
      $("body").each(function(i, body) {
    
        var $ = cheerio.load(body);
        var image = $("img").attr("src")
    
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          image
        });
      });
    
      
    
      // Log the results once you've looped through each of the elements found with cheerio
      
      console.log('--------------------------------------------');
      console.log('TITLE: ' + results[0].title)
      console.log('IMAGE: ' + results[1].image);
      console.log('--------------------------------------------');
    });
    

    console.log(results)

    // post request to backend
    fetch('/api/account/addarticle', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },


      body: JSON.stringify({
        link: addLink,
        // title: results[0],
        // imageLink: results[1],
        uniqueId: token
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json)
        // this is the unique session id. can this be used to find the unique user id? do i need to find that directly?
        console.log('token', token)
        if (json.success) {
          this.setState({
            addLink: '',
          })
        } else {
          this.setState({
            // signUpError: json.message,
            isLoading: false,
          })
        }
      })
  }


  logout() {
    this.setState({
      isLoading: true,
    })
    const obj = getFromStorage('the_main_app')

    if (obj && obj.token) {
      const { token } = obj
      // verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              signInError: '',
              signUpError: '',
              // could also be token: token
              isLoading: false,
            })
          } else {
            this.setState({
              isLoading: false,
              signInError: '',
              signUpError: '',
            })
          }
        });
    } else {
      this.setState({
        isLoading: false,
        signInError: '',
        signUpError: '',
      })
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpError,
      addLink,
      // uniqueId
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }
    // Nead to break the code below into individual components: sign up and sign in

    // broke when i started adding values to the below code
    if (!token) {
      return (
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

            <br />
            <div>
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
          </div>
        </div>
      )
    }

    return (

      <div className='container'>
        <h1 className='center-align'>Dashboard</h1>
        <div className="row">
          <div className="col s12">
            <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                <span className="card-title">Add an Article</span>

                <input
                  type="text"
                  placeholder="Add Link"
                  value={addLink}
                  onChange={this.onTextBoxChangeAddLink} />
                <br /><br />
                <button className='btn' onClick={this.onAddLink}>Save Article</button>
                <br /><br />
              </div>
            </div>
          </div>
        </div>
        <button className='btn' onClick={this.logout}>Logout</button>
      </div>

    );
  }
}

export default Home;