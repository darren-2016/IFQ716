const http = require("http");
require("dotenv").config();

const WEATHERAPI_BASE = "http://api.weatherapi.com/v1";
const API_KEY = process.env.WEATHERAPI_KEY;


// async function weather(res) {
//     console.log("Get weather data");
//     const data = {"condition": "Partly cloudy", "temperature": 28};
//     res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
//     res.write(JSON.stringify(data));
//     res.end();
// }

async function weather(res) {
    const weatherResponse = await fetch(`${WEATHERAPI_BASE}/current.json?key=${API_KEY}&q=Brisbane`);
    const weatherData = await weatherResponse.json();

    const responseData = {"condition": weatherData.current.condition.text, "temperature": weatherData.current.temp_c};

    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.write(JSON.stringify(responseData));
    res.end();
}

function routing(req, res) {
    const url = req.url;
    const method = req.method;
    if (url.startsWith("/weather") && method == "GET") {
        weather(res);
    } else {
        // No page matched the url
        res.write("No matching page");
        res.end();
    }
}

http.createServer(routing).listen(3000, function () {
    console.log("server start at port 3000"); // the server object listens on port
});
