import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
} from '../../utils/storage';
import { Redirect } from 'react-router-dom'
import DashboardNav from "../../components/DashboardNav";

const cheerio = require("cheerio");
const request = require("request");

// const imageStyle = {
//   height: '200px',
//   width: '200px',
//   padding: '2px'
// }

const descriptionTextStyle = {
  color: 'black',
}

class Articles extends Component {
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
      // token,
      results
    } = this.state;

    const self = this

    // console.log("the article is: ", addLink)

    // Make a request call to grab the HTML body from the site of your choice
    request("https://cors-anywhere.herokuapp.com/" + addLink, function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // An empty array to save the data that we'll scrape

      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("head").each(function(i, body) {

        var $ = cheerio.load(body);
        var title = $('meta[property="og:title"]').attr('content');
        var image = $('meta[property="og:image"]').attr('content');
        var description = $('meta[property="og:description"]').attr('content');

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title
        });

        results.push({
          image
        });

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

  // post request to backend

  postToDb() {

    const {
      addLink,
      token,
      results,
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
            isLoading: false,
          })
        }
      })
    this.renderArticles()
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
      addLink,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (this.state.toHome === true) {
      return <Redirect to='/' />
    }

    if (token) {

      return (
       <div>
          <DashboardNav/>
          
          <div className='container'>
        <h1 className='center-align'>My Articles</h1>
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
                {this.state.appendArticles.slice(0).reverse().map(article =>

                  <div className='row'>
                    <div className='col s12'>
                      <div className='card'>
                        <div className='card-image'>
                          <img src={article.imageLink} alt="placeholder" />
                          <span className='card-title'>{article.title}</span>
                        </div>
                        <div className='card-content'>
                          <p style={descriptionTextStyle}>{article.description}</p>
                        </div>
                        <div className='card-action'>
                          <a href={article.link} target="_blank">Read Article</a> | <a onClick={this.deleteFromDb}>Delete Article</a>
                        </div>
                        {/* <div className='card-action'>
                          <a href='#'>Delete Article</a>
                        </div> */}
                      </div>
                    </div>
                  </div>

                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>
      )

    }
    
    return (
      "There is NOT a token."
    )
  }
}

export default Articles;