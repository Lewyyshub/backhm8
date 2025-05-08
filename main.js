const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === "/delete-file") {
    const filepath = parsedUrl.query.filepath;
    fs.unlink(filepath, (err) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found or could not be deleted");
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("File deleted successfully");
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found");
  }
});

server.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000");
});
