import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  //setInStorage,
  getFromStorage,
} from '../../utils/storage';
// import {Redirect} from 'react-router-dom'
import NoMatch from '../../pages/NoMatch'
import DashboardNav from '../../components/DashboardNav'

const cheerio = require("cheerio");
const request = require("request");

const descriptionTextStyle = {
  color: 'black',
}

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
      var str = addLink;

      if (str.includes("youtube")) {
        request("https://cors-anywhere.herokuapp.com/" + addLink, function (error, response, html) {

          var $ = cheerio.load(html);

          $("body").each(function (i, body) {

            var $ = cheerio.load(body);
            var title = $('yt-formatted-string').text()
            // var image = $('meta[property="og:image"]').attr('content');
            // var description = $('meta[property="og:description"]').attr('content');

            // Save these results in an object that we'll push into the results array we defined earlier
            // results.push({
            // title
            // });

            // results.push({
            //   image
            //   });

            //   results.push({
            //     description
            //     });

            console.log('TITLE: ' + title)
          });
          // Log the results once you've looped through each of the elements found with cheerio

          // console.log('--------------------------------------------');
          // console.log('TITLE: ' + results[0].title)
          // console.log('IMAGE: ' + results[1].image);
          // console.log('IMAGE: ' + results[2].description);
          // console.log('--------------------------------------------');
          // self.postToDb()
        })
      }
      else {


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

  // deleteFromDb() {


  //   fetch('/api/deletearticle', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': "application/json"
  //     },

  //     })

  //   this.renderArticles()

  // }

  // Bring articles back to the frontend and display on client device
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
        this.setState({ appendArticles: json })
      } else {
        this.setState({
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

    return (
      <div className='container'>
      <DashboardNav />
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
                </div>
                </div>
                </div>
                </div>
                <div className="row">
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
        </div>
      </div>

    );
  }
}

export default Dashboard;