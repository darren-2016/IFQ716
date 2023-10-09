let http = require("http");
function routing(req, res) {
    const url = req.url;
    const method = req.method;

    if (url.startsWith("/data")) {
        if (method == "GET") {
            // The form page
            res.write("Data");
            res.end();
            return;
        }
    } else if (url.startsWith("/login")) {
        if (method == "POST") {
            // The add page
            res.write("Login");
            res.end();
            return;
        }
    } else if (url.startsWith("/client")) {
        if (method == "GET") {
            // The add page
            res.write("Client");
            res.end();
            return;
        }
    }
    // No page matched the url
    res.write("No matching page");
    res.end();
}

http.createServer(routing).listen(3000, function () {
    console.log("server start at port 3000"); // the server object listens on port 3000
});
