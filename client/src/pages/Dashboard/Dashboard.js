import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  //setInStorage,
  getFromStorage,
} from '../../utils/storage';
// import {Redirect} from 'react-router-dom'
import NoMatch from '../../pages/NoMatch'
// import DashboardNav from '../../components/DashboardNav'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import HeaderDash from "../../components/HeaderDash/HeaderDash.jsx";
import DashFooter from "../../components/DashFooter/DashFooter.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";
import cardImagesStyles from "../../assets/jss/material-dashboard-react/cardImagesStyles.jsx"
import image from "../../assets/img/sidebar-5.jpg";
import logo from "../../assets/img/rdv_logo.png";
import Grid from "@material-ui/core/Grid";
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import FormGroup from '@material-ui/core/FormGroup';
import CustomButtons from "../../components/CustomButtons/Button.jsx";

const cheerio = require("cheerio");
const request = require("request");


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      addLink: '',
      results: [],
      appendArticles: [],
      // toHome: false,
      currentUser: props.match.params.id
    };
    this.onTextBoxChangeAddLink = this.onTextBoxChangeAddLink.bind(this);
    this.onAddLink = this.onAddLink.bind(this)
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
    this.renderArticles()
  }

  onTextBoxChangeAddLink(event) {
    this.setState({
      addLink: event.target.value
    });
  }

  // Grabs link, scrapes and pushes to results array
  onAddLink() {
    
    // grab state
    const {
      addLink,
      token,
      results
    } = this.state;

    const self = this

    function checkLink() {

        // Make a request call to grab the HTML body from the site of your choice
        request("https://cors-anywhere.herokuapp.com/" + addLink, function (error, response, html) {

          // Load the HTML into cheerio and save it to a variable
          // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
          var $ = cheerio.load(html);

          // Select each element in the HTML body from which you want information.
          $("head").each(function(i, body) {

            var $ = cheerio.load(body);
            var title = $('meta[property="og:title"]').attr('content');
            var image = $('meta[property="og:image"]').attr('content');
            var description = $('meta[property="og:description"]').attr('content');

            // Save these results in an object that we'll push into the results array we defined earlier
            const altImage = "https://giphy.com/gifs/internet-google-chrone-9J7tdYltWyXIY"

            results.push({
              title
            });

            results.push({
              image
            })

            results.push({
              description
            });
          });
          // Log the results once you've looped through each of the elements found with cheerio

          console.log('--------------------------------------------');
          console.log('TITLE: ' + results[0].title)
          console.log('IMAGE: ' + results[1].image);
          console.log('DESCRIPTION: ' + results[2].description);
          console.log('--------------------------------------------');
          self.postToDb()
        })
      }
    checkLink()
  }

  // post request to backend
  postToDb() {

    const {
      addLink,
      token,
      results,
      // appendArticles

    } = this.state;

    fetch('/api/addarticle', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        link: addLink,
        title: results[0].title,
        imageLink: results[1].image,
        description: results[2].description,
        uniqueId: this.state.currentUser
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            addLink: '',
            results: [],
          })
        } else {
          this.setState({
            // signUpError: json.message,
            isLoading: false,
          })
        }
      })
    this.renderArticles()
  }

  // Bring articles back to the frontend and display on client device
  renderArticles() {
   
    fetch('/api/appendarticle', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        uniqueId: this.state.currentUser
      }),
    })
    .then(res => res.json())
    .then(json => {
      if (json) {
        console.log("articles returned" + json)
        this.setState({ appendArticles: json })
      } else {
        this.setState({
          isLoading: false,
        })
      }
    })
  }

  // Display page
  state = {
    mobileOpen: false
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if(this.state.mobileOpen){
        this.setState({mobileOpen: false});
      }
    }
  }
  render() {
    const {
      isLoading,
      token,
      addLink,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }
    // if (this.state.toHome === true) {
    //   return <Redirect to = "/" />
    // }
    if (!token) {
      return (
        <NoMatch />
      )
    }

    const { classes } = this.props;
    return (

    <div className={classes.wrapper}>
      <Sidebar
        // logoText={"Ren-dev-ous"}
        logo={logo}
        image={image}
        handleDrawerToggle={this.handleDrawerToggle}
        open={this.state.mobileOpen}
      />

      <div className={classes.mainPanel} ref="mainPanel">
        <HeaderDash
          handleDrawerToggle={this.handleDrawerToggle}
        />

        <div className={classes.content}>
          <div className={classes.container}>
            <Grid container>
                <Card style={{width: '65%'}}>
                  <CardBody>
                    <input
                      style={{width: '75%', margin: '0 20px 0 0'}}
                      type="text"
                      placeholder="Add an Article"
                      value={addLink}
                      onChange={this.onTextBoxChangeAddLink} />
                      <CustomButtons color='primary' onClick={this.onAddLink}>
                        Save Article
                      </CustomButtons>
                  </CardBody>
                </Card>
            </Grid>   
          <Grid container>
            {this.state.appendArticles.slice(0).reverse().map(article =>

          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardHeader>
                <img className={classes.cardImg} style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: 'calc(.25rem - 1px)' }} src={article.imageLink || "https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif"} alt="" />
              </CardHeader>
              <CardBody>
                
                
                <h4 className={classes.cardTitle}>{article.title}</h4>
                          
                          <p className={classes.cardCategory}>{article.description.substr(0, 200)} ...</p>
                        
                        
                          {/* <div className='card-action'>
                            <a href={article.link} target="_blank">Read Article</a> | <a onClick={this.deleteFromDb}>Delete Article</a>
                          </div> */}
                        
                  </CardBody>
                <CardFooter stats>
                  <div className={classes.stats}>
                  
                          <div className='card-action'>
                            <a href={article.link} target="_blank">Read Article</a> | <a onClick={this.deleteFromDb}>Delete Article</a>
                          </div>
                    
                  </div>
                </CardFooter>
            </Card>
          </GridItem>
          )}
          
</Grid>


 
       
                {/* <div className="row">
          <div className="col m12">
                <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                {this.state.appendArticles.slice(0).reverse().map(article =>
                  <div className='row'>
                    <div className='col s12'>
                      <div className='card'>
                        <div className='card-image'>
                          <img src={article.imageLink || "https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif"} alt="placeholder" />
                          <span className='card-title'>{article.title}</span>
                        </div>
                        <div className='card-content'>
                          <p style={descriptionTextStyle}>{article.description}</p>
                        </div>
                        <div className='card-action'>
                          <a href={article.link} target="_blank">Read Article</a> | <a onClick={this.deleteFromDb}>Delete Article</a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}

        </div>
            </div>

<DashFooter />
          </div>

      {/* <DashboardNav /> */}








       
      </div>

    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle, cardImagesStyles)(Dashboard);