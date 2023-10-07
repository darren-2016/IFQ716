// Activity 5
// Form Handling

// Import the 'http' module
const http = require("http");
const fs = require("fs");

const path = "guestBook.json";


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
                let username = body.split('=')[1];
                console.log('username' + username);

                guestBook.push( {name: username });
                // console.log('guestbook' + guestBook);           

                // Add the name in the url params to the guestbook
                // const params = new URLSearchParams(url.split("?")[1]); // Get the part of the url after the first "?"
                // guestBook.push({ name: params.get("name") }); // Get the name param and add it to the guestbook

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

// create a server object
http.createServer(routing).listen(3000, function () {
    console.log("server start at port 3000"); // the server object listens on port 3000
});