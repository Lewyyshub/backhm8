const http = require("http");
const url = require("url");
const fs = require("fs");

const filePath = "/products.json";

function readProducts() {
  try {
    const data = fs.readFileSync(filePath);
    console.log("Read file content:", data.toString());
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading products.json:", e.message);
    return [];
  }
}

function writeProducts(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname.replace(/\/+$/, "");
  const query = parsedUrl.query;

  if (pathname === "/products" && method === "GET") {
    let products = readProducts();
    if (query.priceFrom && query.priceTo) {
      const from = parseFloat(query.priceFrom);
      const to = parseFloat(query.priceTo);
      products = products.filter((p) => p.price >= from && p.price <= to);
    }
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(paginated));
    return;
  }

  if (pathname === "/products" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const newProduct = JSON.parse(body);
      const products = readProducts();
      products.push(newProduct);
      writeProducts(products);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newProduct));
    });
    return;
  }

  if (pathname === "/products" && method === "PUT") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const updatedProduct = JSON.parse(body);
      let products = readProducts();
      const index = products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        products[index] = updatedProduct;
        writeProducts(products);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedProduct));
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Product not found");
      }
    });
    return;
  }

  if (pathname === "/products" && method === "DELETE") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const { id } = JSON.parse(body);
      let products = readProducts();
      const newProducts = products.filter((p) => p.id !== id);
      writeProducts(newProducts);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product deleted" }));
    });
    return;
  }

  if (true) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found");
  }
});

server.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000/");
});
