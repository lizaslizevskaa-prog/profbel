
// Importing the express module to create router instances and handle the routing
const express = require("express");
// Creating a router instance from express to define route handlers
const router = express.Router();

// Importing the HealthController from the Controllers directory
const HealthController = require("../Controllers/health.Controller")

// Defining a GET route on the root path which uses the Health method from HealthController to handle requests
router.get("/" ,HealthController.Health);

// Exporting the router instance to be used in other parts of the application
module.exports = router;
                