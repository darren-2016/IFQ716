/**
 * IFQ716 - Module 2
 * Activity 4: Form Handling
 */

// Import the 'http' module
const http = require("http");
const fs = require("fs");

const path = "guestBook.json";

/**
 * Routing function
 * @param {Object} req Request
 * @param {Object} res Response
 */
function routing(req, res) {
    const url = req.url;

    if (url.startsWith("/form")) { // The form page
        res.writeHead(200, { "Content-Type": "text/html"}); // http header
        res.write(`
            <form action=/add>
                <input name="name">
                <input type="submit">
            </form>
        `);
        res.end();
    } else if (url.startsWith("/add")) { // The add page
        fs.readFile(path, function (err, data) {
            if (err) {
                res.write("You should do some real error handling here");
                res.end();
                return;
            }

            // Try to read from the guestbook. If it fails, set the guest book to empty.
            let guestBook = [];
            try {
                guestBook = JSON.parse(data);
            } catch (e) {}

            // Add the name in the url params to the guestbook
            const params = new URLSearchParams(url.split("?")[1]); // Get the part of the url after the first "?"
            guestBook.push({ name: params.get("name") }); // Get the name param and add it to the guestbook

            // Write the updated guestbook to the filesystem
            fs.writeFile(path, JSON.stringify(guestBook), (err) => {
                if (err) {
                    res.write("You should do some real error handling here");
                    res.end();
                    return;
                }
                res.write("Successfully updated the guestbook");
                res.end();
            });
        });
    } else { // No page matched the url
        res.write("No matching page");
        res.end();
    }
}

/**
 * Create a server object
 */
http.createServer(routing).listen(3000, function () {
    console.log("server start at port 3000"); // the server object listens on port 3000
});
