// Activity 6
// Add some more fields to our guestbook and add a guestbook route

// Import the 'http' and 'fs' modules
const http = require("http");
const fs = require("fs");

const path = "guestBook.json";


function routing(req, res) {
    const url = req.url;

    if (url.startsWith("/form")) { // The form page
        res.writeHead(200, { "Content-Type": "text/html"}); // http header
        res.write(`
            <form action=/add method="post">
                <label for="name">Name</label>
                <input name="name"><br>
                <label for="age">Age</label>
                <input name="age"><br>
                <label for="gender">Gender</label>
                <input name="gender"><br>
                <label for="comment">Comment</label>
                <input name="comment"><br>
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
            console.log('body: ' + body);

            req.on('end', () => {
                console.log('body : ' + body);
                res.write('OK');
                res.end();

                // Get the name from the data
                const searchParams = new URLSearchParams(body);
                console.log(searchParams.get("name"));
                console.log(searchParams.get("age"));
                console.log(searchParams.get("gender"));
                console.log(searchParams.get("comment"));
                // return;

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
    } else if (url.startsWith("/read")) {
        res.write("READ");
        // res.writeHead();
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