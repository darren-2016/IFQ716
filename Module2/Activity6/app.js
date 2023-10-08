// Activity 6
// Add some more fields to our guestbook and add a guestbook route

// Import the 'http' and 'fs' modules
import { writeFile, readFile } from 'fs';
import * as http from 'http';


const path = "./guestBook.json";

/**
 * Helper function for reading the JSON file
 * @param {string} path File path to JSON file
 * @return {}  
 */
async function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        readFile(path, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns None
 */
async function readGuestbook(req, res) {

    try {
        const response = await readFileAsync(path);
        console.table(JSON.parse(response));

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(JSON.parse(response)));
        res.statusCode = 200;
        return res.end();
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.write('Failed to load JSON file');
        return res.end();
    }
}


/**
 * Routing function
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function routing(req, res) {
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
    } 
    else if (url.startsWith("/add")) { // The add page
        readFile(path, function (err, data) {
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
                const guestName = searchParams.get("name");
                const guestAge = searchParams.get("age");
                const guestGender = searchParams.get("gender");
                const guestComment = searchParams.get("comment");
                
                console.log(guestName);
                console.log(guestAge);
                console.log(guestGender);
                console.log(guestComment);
              
                // Add the name to the guestbook
                guestBook.push( {name: guestName, age: guestAge, gender: guestGender, comment: guestComment });
                
                // Write the updated guestbook to the filesystem
                console.log('Write to guestbook');
                writeFile(path, JSON.stringify(guestBook), (err) => {
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
    } else if (url.startsWith("/read")) { // read from guestbook JSON data file and display contents
        let guestBook = await readGuestbook(req, res);

        // console.log(guestBook);
        // return;            
        
        
        res.end();
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
