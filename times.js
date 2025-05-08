const http = require("http");
const url = require("url");
const moment = require("moment-timezone");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === "/time" && query.city) {
    const city = query.city;
    const timezones = {
      London: "Europe/London",
      "New York": "America/New_York",
      Berlin: "Europe/Berlin",
      Madrid: "Europe/Madrid",
      Peking: "Asia/Shanghai",
      Kiev: "Europe/Kiev",
    };

    const timezone = timezones[city];

    if (timezone) {
      const time = moment.tz(timezone).format("YYYY-MM-DD HH:mm:ss");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ city, time }));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("City not supported");
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Route not found");
});

server.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000");
});
