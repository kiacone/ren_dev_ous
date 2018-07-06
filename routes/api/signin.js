const User = require('../../models/User')
const UserSession = require('../../models/UserSession')
const Articles = require('../../models/Articles')
const cheerio = require("cheerio");
const request = require("request");``

module.exports = (app) => {

    // Sign up
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        console.log('body', body)
        const {
            firstName,
            lastName,
            password
        } = body;
        let {
            email
        } = body;

        if (!firstName) {
            return res.send({
                success: false,
                message: "Error: first name cannot be blank"
            })
        };

        if (!lastName) {
            return res.send({
                success: false,
                message: "Error: last name cannot be blank"
            })
        };

        if (!email) {
            return res.send({
                success: false,
                message: "Error: email cannot be blank"
            })
        };

        if (!password) {
            return res.send({
                success: false,
                message: "Error: password cannot be blank"
            });
        }

        console.log('here');

        email = email.toLowerCase();

        // steps:
        // 1. verify email doesn't already exist
        // 2. save

        User.find({
            email: email
        }, (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                })
            } else if (previousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exists'
                })
            }

            // save new user
            const newUser = new User()

            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })
                }
                return res.send({
                    success: true,
                    message: 'Signed up!'
                });
            });
        });
    });

    // Sign in
    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const {

            password
        } = body;
        let {
            email
        } = body;

        if (!email) {
            return res.send({
                success: false,
                message: "Error: email cannot be blank"
            })
        };

        if (!password) {
            return res.send({
                success: false,
                message: "Error: password cannot be blank"
            });
        }

        email = email.toLowerCase()

        User.find({
            email: email
        }, (err, users) => {
            if (err) {
                console.log('err 2', err);
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                })
            }
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                })
            }

            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                })
            }

            // otherwise create user session
            const userSession = new UserSession()
            userSession.userId = user._id,
                userSession.save((err, doc) => {
                    if (err) {
                        console.log(err)
                        return res.send({
                            success: false,
                            message: 'Error: Server error'
                        })
                    }

                    return res.send({
                        success: true,
                        message: 'valid sign in',
                        token: doc._id
                    })
                })
        })
    });

    // Verify
    app.get('/api/account/verify', (req, res, next) => {
        // get the token
        const { query } = req;
        const { token } = query;
        // token test
        // verify the token is one of a kind and not deleted

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if (err) {
                console.log(err)
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Good'
                })
            }
        });






    });

    // Logout
    app.get('/api/account/logout', (req, res, next) => {
        // Get the token
        const { query } = req;
        const { token } = query;
        // ?token=test
        // Verify the token is one of a kind and it's not deleted.
        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false
        }, {
                $set: {
                    isDeleted: true
                }
            }, null, (err, sessions) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Good'
                });
            });
    });

    app.post('/api/account/addarticle', (req, res, next) => {
        const { body } = req;
        const {
            link,
            title,
            imageLink,
            uniqueId
        } = body;
        // let {
        //     email
        // } = body;
        console.log('body:', body)
        

        // console.log('imageLink: ' + imageLink)

        console.log(imageLink)

        if (!link) {
            return res.send({
                success: false,
                message: "Error: link field cannot be blank"
            })
        };


        Articles.updateOne({
            link: link,
            title: body.title,
            imageLink: body.imageLink,
            uniqueId: uniqueId,
        },
            (err, previousUsers) => {
                // if (err) {
                //     return res.send({
                //         success: false,
                //         message: 'You already saved this article!'
                //     })
                // }
                // else if (previousUsers.length > 0) {
                //     return res.send({
                //         success: false,
                //         message: 'Error: Account already exists'
                //     })
                // }

                // save new user
                const newArticle = new Articles()

                newArticle.link = link;
                newArticle.title = title;
                newArticle.imageLink = imageLink;
                newArticle.uniqueId = uniqueId

                newArticle.save((err, user) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error: Server error'
                        })
                    }
                    return res.send({
                        success: true,
                        message: 'Article saved!'
                    });
                });
            });
    });

    // Bring articles back to front end
    
    app.post('/api/account/addarticle', (req, res, next) => {
        const { body } = req;
        const {
                link,
            // title,
            // imageLink,
            // uniqueId
        } = body;
        // let {
        //     email
        // } = body;
        console.log('body:', body)
        

        // console.log('imageLink: ' + imageLink)

        // if (!link) {
        //     return res.send({
        //         success: false,
        //         message: "Error: link field cannot be blank"
        //     })
        // };


        Articles.updateOne({
            link: link,
            // title: body.title,
            // imageLink: body.imageLink,
            // uniqueId: uniqueId,
        },
            (err, previousUsers) => {
                // if (err) {
                //     return res.send({
                //         success: false,
                //         message: 'You already saved this article!'
                //     })
                // }
                // else if (previousUsers.length > 0) {
                //     return res.send({
                //         success: false,
                //         message: 'Error: Account already exists'
                //     })
                // }

                // save new user
                const newArticle = new Articles()

                newArticle.link = link;
                // newArticle.title = title;
                // newArticle.imageLink = imageLink;
                // newArticle.uniqueId = uniqueId

                newArticle.save((err, user) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error: Server error'
                        })
                    }
                    return res.send({
                        success: true,
                        message: 'Article Appended!'
                    });
                });
            });
    });

};

    // const results = []
    // // Add Article
    // app.post('/api/account/addarticle', (req, res, next) => {
    //     const { body } = req;
        
    //     console.log('body', body)
    //     const {
    //         link,
    //         // title,
    //         // imageLink,
    //         // description,
    //         uniqueId,
            
    //     } = body;
    //     // let {
    //     //     email
    //     // } = body;
    //     console.log(link)
    //     // console.log(title)


    //     if (!link) {
    //         return res.send({
    //             success: false,
    //             message: "Error: link field cannot be blank"
    //         })
    //     };

    //     // const results = []
    //     // const article = link
   
    
    // // Make a request call to grab the HTML body from the site of your choice
    // request("https://cors-anywhere.herokuapp.com/" + link, function(error, response, html) {
    
    //   // Load the HTML into cheerio and save it to a variable
    //   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    //   var $ = cheerio.load(html);
    
    //   // An empty array to save the data that we'll scrape
    
    //   // Select each element in the HTML body from which you want information.
    //   // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    //   // but be sure to visit the package's npm page to see how it works
    //   $("head").each(function(i, body) {
    
    //     const $ = cheerio.load(body);
    //      const title = $('title').text();
    //     //  const title = $('meta[property="og:title"]').attr('content');
    //     //  const image = $('meta[property="og:image"]').attr('content');
    //     //  const description = $('meta[property="og:description"]').attr('content');
    
    //     // Save these results in an object that we'll push into the results array we defined earlier
    //     results.push({
    //         title,
    //         // image,
    //         // description
    //     });
    //   });
    
      
    
    //   // Log the results once you've looped through each of the elements found with cheerio
      
    //   console.log('--------------------------------------------');
    //   console.log("the article is: ", link);
    //   console.log("the results are: ", results);
    // //   console.log('TITLE: ' + results[0].title[0]);
    // //   console.log('IMAGE: ' + results[1]);
    // //   console.log('DESCRIPTION: ' + results[2]);
    //   console.log('--------------------------------------------');
    // });





        // steps:
        // 1. verify email doesn't already exist
        // 2. save

        // Articles.updateOne({
        //     link: link,
        //     title: results[0],
        //     imageLink: results[1],
        //     description: results[2],
        //     uniqueId: uniqueId
        // },
        //     (err, previousUsers) => {
        //         if (err) {
        //             return res.send({
        //                 success: false,
        //                 message: 'Error: Server error'
        //             })
        //         }
        //         // else if (previousUsers.length > 0) {
        //         //     return res.send({
        //         //         success: false,
        //         //         message: 'Error: Account already exists'
        //         //     })
        //         // }

        //         // save new user
        //         const newArticle = new Articles()

        //         newArticle.link = link;
        //         newArticle.title = title;
        //         newArticle.imageLink = imageLink;
        //         newArticle.description = description;
        //         newArticle.uniqueId = uniqueId

        //         newArticle.save((err, user) => {
        //             if (err) {
        //                 return res.send({
        //                     success: false,
        //                     message: 'Error: Server error'
        //                 })
        //             }
        //             return res.send({
        //                 success: true,
        //                 message: 'Article saved!'
        //             });
        //         });
        //     });
//     });

    
    

// };