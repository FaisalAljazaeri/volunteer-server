//Require necearry NPM pacjage
const express = require("express");

//Require Mongoose Model for Organization
const Organization = require("../model/Organization");

//Require Mongoose Model for Post
const Post = require("../model/Post");
//Instantiate a Router (min app that only handles routes)
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Autherization Middleware
const auth = require("../middlewares/organizationAuth");

const saveOrganization = (organization, res) => {
    // Hash the password before saving the organization to the DB
    bcrypt
        .hash(organization.password, 10)
        .then(hashedPassword => {
            // Replace the plain password with the hashed password
            organization.password = hashedPassword;
            // Create new organization in the database
            return Organization.create(organization);
        })
        .then(organization =>
            res
                .status(201)
                .json({
                    organization: {
                        name: organization.name,
                        id: organization._id
                    }
                })
        )
        .catch(err => res.status(500).json({ msg: err.message }));
};

/**
 * @method GET
 * @route  /api/organizations
 * @action  INDEX
 * @desc    Get All organizations
 */
router.get("/api/organizations", (req, res) => {
    Organization.find()
        // Return all organization as an Array
        .then(organization => {
            res.status(200).json({ organizations: organization });
            console.log(organizations);
        })
        // Catch any errors that might occur
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

/**
 * @method : GET
 * @route : /api/organizations/logout
 * @action :  Logout
 * @desc    : logout organizations
 */
router.get("/api/organizations/logout", (req, res) => {
    if (req.cookies.organizationToken) {
        res.status(200)
            .setHeader('Access-Control-Allow-Headers', 'Set-Cookie')
            .clearCookie("organizationToken")
            .end();
    } else {
        res.status(500).json({ error: "Failed to logout" });
    }
});

/**
 * @method GET
 * @route  /api/organizations:id
 * @action  SHOW
 * @desc    Get An organizations by organizations ID
 */
router.get("/api/organizations/:id", (req, res) => {
    Organization.findById(req.params.id)
        .then(organization => {
            if (organization) {
                res.status(200).json({ organizations: organization });
            } else {
                // If we couldn't find a document with the matching ID
                res.status(404).json({
                    error: {
                        name: "DocumentNotFoundError",
                        message: "The provided ID doesn't match any documents"
                    }
                });
            }
        })
        // Catch any errors that might occur
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

/**
 * @method POST
 * @route   /api/organizations
 * @action  CREATE
 * @desc    Create a new organizations
 */
router.post("/api/organizations", (req, res) => {
    // Get the Organization object from the request body
    const newOrganization = req.body.organization;
    // Check if the name already exists
    Organization.findOne({ name: newOrganization.name })
        .then(organization => {
            if (organization) {
                return res.status(500).json({ msg: "Name already exists." });
            } else {
                // In case the name is not already used save the new Organization.
                saveOrganization(newOrganization, res);
            }
        })
        .catch(err => res.status(500).json({ msg: err.message }));
});

/**
 * @method : POST
 * @route : /api/organization/login
 * @action :  Login
 * @desc    : Login Orgnization
 */
router.post("/api/organizations/login", (req, res) => {
    // Get Organization object from the request body
    const organization = req.body.organization;
    // validate user inputs
    if (!organization.name || !organization.password) {
        return res
            .status(500)
            .json({ msg: "Please enter both name and password" });
    }
    // Var to hold org ID
    let orgId = 0;

    // Authenricate Organization
    Organization.findOne({ name: organization.name })
        .then(organizationDoc => {
            // If the name doesn't exist return error message
            if (!organizationDoc) {
                return res.status(500).json({ msg: "Name doesn't exist" });
            }
            //set org ID
            orgId = organizationDoc._id;
            // Check if the given password matches the one in the database
            return bcrypt.compare(
                organization.password,
                organizationDoc.password
            );
        })
        .then(same => {
            // If the 'same' parameter is true that means the password is correct
            if (same) {
                // Issue token for authenticated Organization
                const payload = { name: organization.name };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "12h"
                });
                // Save the issued token in cookies
                return res
                    .cookie("organizationToken", token, { httpOnly: true })
                    .setHeader("Access-Control-Allow-Headers", "Set-Cookie")
                    .status(200)
                    .json({
                        organization: { id: orgId, name: organization.name }
                    })
                    .end();
            }
            // Case of wrong password
            return res.status(500).json({ msg: "wrong password" });
        })
        .catch(err => res.status(500).json({ msg: err.message }));
});

/**
 * @method DELETE
 * @route   /api/organizations/id
 * @action  DESTROY
 * @desc    Delete An organization by organization ID
 */
router.delete("/api/organizations/:id", auth, (req, res) => {
    // Find the organization with the passed ID
    Organization.findById(req.params.id)
        .then(organization => {
            // Check if a organization is found by the passed ID
            if (organization) {
                // pass the result of Mongoose's  .delete method to next.then statment
                return organization.delete();
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
        // Delete Post organization by organization ID
        .then(() => {
            return Post.deleteMany({ organization: req.params.id });
        })
        .then(() => {
            // If the update succeeded, return 204 and no JSON response

            res.status(204).end();
        })
        .catch(error => res.status(500).json({ error }));
});

/**
 * @method PATCH
 * @route   /api/organizations/:id
 * @action  UPDATE
 * @desc    Update a organizations by ID
 */
router.patch("/api/organizations/:id", auth, (req, res) => {
    // Find the organization with the passed ID
    Organization.findById(req.params.id)
        .then(organization => {
            // Check if a organization is found by the passed ID
            if (organization) {
                // Update the existing organization with the new data from the request body
                return organization.update(req.body.organizations);
            } else {
                // If no organization was found by the passed ID, send an error message as response
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
