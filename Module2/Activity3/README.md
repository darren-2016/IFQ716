# IFQ716 Module 2 - Activity 3: Basic routing

Implementation of Simple routing to respond to changes to the URL.

Two routes will be implemented:
 - a route to contain an HTML Form
 - a route to consume the form data and write it to disk

The routing function accepts a couple of parameters, `req` and `res`.  The URL is obtained by looking at `req.url`.

From the URL obtained, the routing can be determined using `url.startsWith()`, and from there the `res` parameters is used to render the HTML page accordingly, using `res.write()` and `res.end()`.

The `http.createServer()` function takes the `routing()` function as its parameter.

Spin up this server using `npm start`, and then open the following pages in the browser:
 - localhost:3000/
 - localhost:3000/form
 - localhost:3000/add

