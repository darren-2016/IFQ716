/**
 * Module 2
 * Activity 1: Creating a more versatile Node server
 * This activity shows how to do real backend operations.
 */

// Import the 'http' module
const http = require("http");

/**
 * Create a server object, which will serve the ubiquitous 'Hello World!' message
 */
http
    .createServer(function (req, res) {
        res.write("Hello World!"); // write a response
        res.end(); // end the response
    })
    .listen(3000, function () {
        console.log("server start at port 3000"); // the server object listens on port 3000
    });
