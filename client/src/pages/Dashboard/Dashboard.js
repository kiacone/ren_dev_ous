import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
} from '../../utils/storage';
import { Redirect } from 'react-router-dom'

const cheerio = require("cheerio");
const request = require("request");

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      toHome: false,
      token: '',
      dashboard: '',
      addLink: '',
      results: [],
      appendArticles: []
    };

    this.onTextBoxChangeAddLink = this.onTextBoxChangeAddLink.bind(this);
    this.onAddLink = this.onAddLink.bind(this)
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

  onTextBoxChangeAddLink(event) {
    this.setState({
      addLink: event.target.value

    });
  }

  onAddLink() {
    // grab state
    const {
      addLink,
      token,
      results
    } = this.state;

    const self = this

    console.log("the article is: ", addLink)

    // Make a request call to grab the HTML body from the site of your choice
    request("https://cors-anywhere.herokuapp.com/" + addLink, function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // An empty array to save the data that we'll scrape

      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("head").each(function (i, body) {

        var $ = cheerio.load(body);
        var title = $("title").text();

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title
        });

      });

      $("body").each(function (i, body) {

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
      self.postToDb()
    })

  }

  // console.log(this.state)
  // console.log(results)

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
        uniqueId: token
      }),
    })
      .then(res => res.json())
      .then(json => {
        // console.log('json', json)
        // this is the unique session id. can this be used to find the unique user id? do i need to find that directly?
        // console.log('token', token)
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

  renderArticles() {
    // grab state
    // let {
    //   appendArticles
    // } = this.state;

    fetch('/api/appendarticle', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },

    })
      .then(res => res.json())
      .then(json => {
        // console.log('this json!!!!!! json', json)
        // appendArticles = json
        // json = JSON.stringify(json)
        console.log('here!!!!' + json)
        if (json) {

          console.log("success")
          this.setState({appendArticles: json})

          console.log(this.state)
        } else {
          this.setState({
            // signUpError: json.message,
            isLoading: false,
          })
        }
      })

    // console.log(this.state)
    console.log("articles: ", this.state)
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
              toHome: true,
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
      addLink,
      // uniqueId
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (this.state.toHome === true) {
      return <Redirect to='/' />
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
                
                {this.state.appendArticles.map(article => article.title)}
                
              </div>
            </div>
          </div>
        </div>
        <button className='btn' onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default Dashboard;