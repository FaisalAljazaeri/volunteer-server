//Require necearry NPM pacjage
const express = require("express");

//Require Mongoose Model for Users
const User = require("../model/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// Autherization Middleware
const auth = require("../middlewares/userAuth");

//Instantiate a Router (min app that only handles routes)
const router = express.Router();
//method to Add User to DataBase
const saveUser = (user, res) => {
    // Hash the password before saving the user to the DB
    bcrypt
        .hash(user.password, 10)
        .then(hashedPassword => {
            // Replace the plain password with the hashed password
            user.password = hashedPassword;
            // Create new user in the database
            return User.create(user);
        })
        .then(user =>
            res.status(201).json({ user: { name: user.name, id: user._id } })
        )
        .catch(err => res.status(500).json({ msg: err.message }));
};

/**
 * @method : GET
 * @route : /api/users/logout
 * @action :  Logout
 * @desc    : logout users
 */
router.get("/api/users/logout", (req, res) => {
    if (req.cookies.userToken) {
        res.status(200)
            .clearCookie("userToken")
            .end();
    } else {
        res.status(500).json({ error: "Failed to logout" });
    }
});

/**
 * @method : GET
 * @route : /api/user
 * @action :  index
 * @desc    : get all user
 */
router.get("/api/users", (req, res) => {
    User.find()
        .then(user => {
            res.status(200).json({ users: user });
        })
        //catch any errors that may accours
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

/**
 * @method : GET
 * @route : /api/user/id
 * @action :  Show
 * @desc    : get an user by user ID
 */
router.get("/api/users/:id", (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json({ users: user });
            } else {
                // if we coudn't find a document with matching ID
                res.status(404).json({
                    error: {
                        name: "DocumentNotFoundError ",
                        message: "The  providednId dosen't match any documents"
                    }
                });
            }
        })
        //catch any errors that may accours
        .catch(error => {
            res.status(500).json({ error: error });
        });
});
/**
 * @method POST
 * @route   /api/users
 * @action  CREATE
 * @desc    Create a new user
 */
router.post("/api/users", (req, res) => {
    // Get the user object from the request body
    const newUser = req.body.user;
    // Check if the name already exists
    User.findOne({ name: newUser.name })
        .then(user => {
            if (user) {
                return res.status(500).json({ msg: "Name already exists." });
            } else {
                // In case the name is not already used save the new user.
                saveUser(newUser, res);
            }
        })
        .catch(err => res.status(500).json({ msg: err.message }));
});

/**
 * @method : POST
 * @route : /api/users/login
 * @action :  Login
 * @desc    : Login User
 */
router.post("/api/users/login", (req, res) => {
    // Get user object from the request body
    const user = req.body.user;
    // validate user inputs
    if (!user.name || !user.password) {
        return res
            .status(500)
            .json({ msg: "Please enter both name and password" });
    }
    // Var to hold user id if found
    let userId = 0;

    // Authenricate user
    User.findOne({ name: user.name })
        .then(userDoc => {
            // If the name doesn't exist return error message
            if (!userDoc) {
                return res.status(500).json({ msg: "Name doesn't exist" });
            }

            // set id
            userId = userDoc._id;
            // Check if the given password matches the one in the database
            return bcrypt.compare(user.password, userDoc.password);
        })
        .then(same => {
            // If the 'same' parameter is true that means the password is correct
            if (same) {
                // Issue token for authenticated user
                const payload = { name: user.name };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "12h"
                });
                // Save the issued token in cookies
                res.setHeader('Cache-Control','private');
                return res
                    .cookie("userToken", token, { httpOnly: true })
                    .status(200)
                    .json({ user: { name: user.name, id: userId } })
                    .end();
            }
            // Case of wrong password
            return res.status(500).json({ msg: "wrong password" });
        })
        .catch(err => res.status(500).json({ msg: err.message }));
});

/**
 * @method PATCH
 * @route   /api/users/id
 * @action  UPDATE
 * @desc    Update a user by ID
 */
router.patch("/api/users/:id", auth, (req, res) => {
    // Find the user with the passed ID
    User.findById(req.params.id)
        .then(user => {
            // Check if a user is found by the passed ID
            if (user) {
                // Update the existing user with the new data from the request body
                return user.update(req.body.user);
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
/**
 * @method  : delete
 * @route   : /api/users/id
 * @action  : Destory
 * @desc    : delete an user by user ID
 */
router.delete("/api/users/:id", auth, (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (user) {
                //pass the result of mongooes's ".delete" method to thee next ".then"
                user.remove();
            } else {
                // if we coudn;t find a document with matching ID
                res.status(404).json({
                    error: {
                        name: "DocumentNotFoundError ",
                        message: "The  providednId dosen't match any documents"
                    }
                });
            }
        })
        //another then
        .then(() => {
            // if the deletion succeeded , return 204 and no JSON
            res.status(204).end();
        })
        .catch(error => {
            res.status.json({ error: error });
        });
});

//export the Router
module.exports = router;
