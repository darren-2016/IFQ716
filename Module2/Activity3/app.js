/**
 * IFQ716 - Module 2
 * Activity 3: Basic routing
 * 
 */

// Import the 'http' module
const http = require("http");

/**
 * Routing function
 * @param {Object} req Request
 * @param {Object} res Response
 */
function routing(req, res) {
    const url = req.url;

    if (url.startsWith("/form")) { // The form page
        res.write("Form");
        res.end();
    } else if (url.startsWith("/add")) { // The add page
        res.write("Add");
        res.end();
    } else { // No page matched the url
        res.write("No matching page");
        res.end();
    }
}

/**
 * Create a server object, with the routing function as its parameter
 */
http.createServer(routing).listen(3000, function () {
    console.log("server start at port 3000"); // the server object listens on port 3000
});
