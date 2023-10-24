/**
 * Weather App
 * Server-side
 */

const http = require("http");
require("dotenv").config();

const WEATHERAPI_BASE = "http://api.weatherapi.com/v1";
const API_KEY = process.env.WEATHERAPI_KEY;

const REFRESH_INTERVAL = 30000;

let weatherData = {};
let timeOfLastAccess = 0;

// async function weather(res) {
//     console.log("Get weather data");
//     const data = {"condition": "Partly cloudy", "temperature": 28};
//     res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
//     res.write(JSON.stringify(data));
//     res.end();
// }

/**
 * weather function, which access the WeatherAPI endpoint to get the current weather
 * @param {Object} res Response
 * @param {string} city City
 */
async function weather(res, city) {
    let currentTime = Date.now();

    if(currentTime - timeOfLastAccess > REFRESH_INTERVAL) {
        timeOfLastAccess = Date.now();
        console.log('Get weather data object from API');
        const weatherResponse = await fetch(`${WEATHERAPI_BASE}/current.json?key=${API_KEY}&q=${city}`);
        weatherData = await weatherResponse.json();
    }

    const responseData = {"condition": weatherData.current.condition.text, "temperature": weatherData.current.temp_c, "icon": weatherData.current.condition.icon};

    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.write(JSON.stringify(responseData));
    res.end();
}

/**
 * Routing function
 * @param {Object} req Request
 * @param {Object} res Response
 */
function routing(req, res) {
    const url = req.url;
    console.log("url = " + url);
    const method = req.method;
    if (url.startsWith("/weather") && method == "GET") {
        const params = new URLSearchParams(url.split("?")[1]);
        const location = params.get("q");
        console.log('location = ' + location);
        weather(res, location);
    } else {
        // No page matched the url
        res.write("No matching page");
        res.end();
    }
}

/**
 * Create server
 */
http.createServer(routing).listen(3000, function () {
    console.log("server start at port 3000"); // the server object listens on port
});
