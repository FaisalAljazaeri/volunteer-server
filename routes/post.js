//Require necearry NPM pacjage
const express = require("express");
//Require Mongoose Model for Organization
const Post = require('../model/Post')
//Instantiate a Router (min app that only handles routes)
const router = express.Router();


/**
 * @method GET
 * @route  /api/posts
 * @action  INDEX
 * @desc    Get All posts 
 */
router.get('/api/posts', (req, res) => {
    Post.find()
        .populate("organization", "name")
        .populate("users", "name")
    // Return all post as an Array
    .then((post) => {
      res.status(200).json({ post });
      console.log(posts)
    })
    // Catch any errors that might occur
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });


/**
 * @method GET
 * @route  /api/posts:id
 * @action  SHOW
 * @desc    Get An posts by posts ID
 */
router.get('/api/posts/:id', (req, res) => {
    Post.findById(req.params.id)
        .populate("organization", "name")
        .populate("users", "name")
        .then((post) => {
          if (post) {
            res.status(200).json({posts: post});
          } else {
            // If we couldn't find a document with the matching ID
            res.status(404).json({
              error: {
                name: 'DocumentNotFoundError',
                message: 'The provided ID doesn\'t match any documents'
              }
            });
          }
        })


        // Catch any errors that might occur
        .catch((error) => {
          res.status(500).json({ error: error });
        })
    });


/**
 * @method POST
 * @route   /api/posts
 * @action  CREATE
 * @desc    Create a new posts
 */
router.post("/api/posts", (req, res) => {
    // Add the organizations recieved from the request body to the database
    Post.create(req.body.post)
        .then(post => res.status(201).json({ post }))
        .catch(error => res.status(500).json({ error }));
});


/**
 * @method PATCH
 * @route   /api/posts/:id
 * @action  UPDATE
 * @desc    Update a posts by ID
 */
router.patch("/api/posts/:id", (req, res) => {
    // Find the post with the passed ID
    Post.findById(req.params.id)
        .then(post => {
            // Check if a post is found by the passed ID
            if (post) {
                // Update the existing post with the new data from the request body
                return post.update(req.body.posts);
            
            } else {
                // If no post was found by the passed ID, send an error message as response
                res.status(404).json({
                    error: {
                        name: "DocumentNotFoundError",
                        message: "The provided ID doesn't match any documents"
                    }
                });
            }
        })
        .then(() => {
            // If the update succeeded, return 204 and no JSON response
            res.status(204).end();
        })
        .catch(error => res.status(500).json({ error }));
});


/**
 * @method DELETE
 * @route   /api/posts/id
 * @action  DESTROY
 * @desc    Delete An post by post ID
 */
router.delete("/api/posts/:id", (req, res) => {
    // Find the post with the passed ID
    Post.findById(req.params.id)
        .then(post => {
            // Check if a post is found by the passed ID
            if (post) {
               // pass the result of Mongoose's  .delete method to next.then statment
                return post.delete();
            } else {
                // If no user was found by the passed ID, send an error message as response
                res.status(404).json({
                    error: {
                        name: "DocumentNotFoundError",
                        message: "The provided ID doesn't match any documents"
                    }
                });
            }
        })
        .then(() => {
            // If the update succeeded, return 204 and no JSON response
            res.status(204).end();
        })
        .catch(error => res.status(500).json({ error }));
});



//export the Router 
module.exports = router;