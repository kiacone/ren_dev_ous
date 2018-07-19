import React from "react";
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";
import People from "@material-ui/icons/People";
// core components
import Header from "../../components/Header/Header.js";
import HeaderLinks from "../../components/Header/HeaderLinks.jsx";
import Footer from "../../components/Footer/Footer.js";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import logo from "../../assets/img/rdv_logo.png";
import loginPageStyle from "../../assets/jss/material-dashboard-react/layouts/loginPage.jsx";

import image from "../../assets/img/sidebar-5.jpg";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
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
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
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
          <div
            className={classes.pageHeader}
            style={{
              backgroundImage: "url(" + image + ")",
              backgroundSize: "cover",
              backgroundPosition: "top center"
            }}
          >
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <Card className={classes[this.state.cardAnimaton]}>
                    <form className={classes.form}>
                      {
                        (signInError) ? (
                          <p>{signInError}</p>
                        ) : (null)
                      }
                      <CardHeader color="primary" className={classes.cardHeader}>
                        <h2>Login</h2>
                      </CardHeader>
                      <p className={classes.divider}><a href="/">Go back home.</a></p>
                      <CardBody>
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
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                      <Button className={classes.button} onClick={this.onSignIn}>Sign In
                        <i class="material-icons right">send</i>
                      </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
      );
    }
    return (
      // <Redirect to ='/signin' />
      <h1>some text</h1>
    );
  }
}

export default withStyles(loginPageStyle)(SignIn);
