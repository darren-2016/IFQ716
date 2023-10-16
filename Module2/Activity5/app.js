/** IFQ716 Module 2 - Activity 5: Form Handling
 *
 */

// Import the 'http' module
const http = require("http");
const fs = require("fs");

const path = "guestBook.json";

/**
 * 
 * @param {Object} req Request
 * @param {Object} res Response
 */
function routing(req, res) {
    const url = req.url;

    if (url.startsWith("/form")) { // The form page
        res.writeHead(200, { "Content-Type": "text/html"}); // http header
        res.write(`
            <form action=/add method="post">
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


            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                console.log('body : ' + body);
                res.write('OK');
                res.end();

                // Get the name from the data
                let guestname = body.split('=')[1];
                
                // Add the name to the guestbook
                guestBook.push( {name: guestname });
                
                // Write the updated guestbook to the filesystem
                console.log('Write to guestbook');
                fs.writeFile(path, JSON.stringify(guestBook), (err) => {
                    if (err) {
                        console.log('Error writing to file');
                        res.write("You should do some real error handling here");
                        res.end();
                        return;
                    }
                    console.log('Success writing to file');
                    res.write("Successfully updated the guestbook");
                    res.end();
            });
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
