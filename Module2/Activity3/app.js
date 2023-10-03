// Import the 'http' module
const http = require("http");

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

// create a server object
http.createServer(routing).listen(3000, function () {
    console.log("server start at port 3000"); // the server object listens on port 3000
});
