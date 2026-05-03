# Section 2: Introduction to Node.js and NPM

---

### 5. What is Node.js and Why Use It?

---

Node JS Pros

- Single-threaded, based on event driven, non-blocking I/O Model
- Perfect fo building fast and scalable data-intensive apps

Use cases:

- API with database behind it
- Data streaming
- Real-time chat application
- Server-side web application

Do not use for:
-Application with heavy server-side processing (CPU-Intensive)

---

###

---

### 8. Rading and Writing files

- Uses Node’s `fs` module to read and write files synchronously
- `readFileSync` loads file content into memory (blocking operation)
- Processes data using a template literal and timestamp
- `writeFileSync` creates/overwrites the output file (also blocking)
- Suitable for simple scripts, not recommended for production due to blocking I/O

```js
const fs = require("fs");
// Simple command to read file
const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); // 2 Arguments, directory and encoding
// console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// Write to a file, 2 arguments - Specify which file and the content
fs.writeFileSync("./txt/output.txt", textOut);

console.log("File written");
```

---

### 10. Reading and Writing Files Asynchronously

---

```js
// Sync vs Async (Node.js execution model)

const fs = require("fs");

// ======================
// SYNC (Blocking)
// ======================

// Reads file synchronously → blocks event loop until finished
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// Processes data immediately after read completes
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// Writes file synchronously → also blocks execution
fs.writeFileSync("./txt/output.txt", textOut);

// This only runs after ALL sync operations above are done
console.log("File written");

// ======================
// ASYNC (Non-blocking)
// ======================

// Starts async file read → delegated to OS / libuv
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log(err);

  // Runs later, after sync code has finished
  console.log(data1);

  // Uses result of first file to read another file (dependent async flow)
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    if (err) return console.log(err);

    console.log(data2);

    // Third async operation nested inside → increases complexity
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      if (err) return console.log(err);

      console.log(data3);
    });
  });
});

// This runs BEFORE any async callbacks above
console.log("will read file>>>");

// ======================
// KEY POINTS
// ======================

// - Sync code blocks → runs fully before anything else
// - Async code is delegated → does not block execution
// - Callbacks run later via the event loop
// - Execution order:
//   1. Sync code
//   2. Async callbacks (when completed)
// - Nested callbacks = "callback hell" → hard to read/maintain
```

---

### 11. Creating a Simple Web Server

---

```js
const http = require("http"); // Core module to create HTTP server

// ======================
// CREATE SERVER
// ======================

// Callback runs on EVERY incoming request
const server = http.createServer((req, res) => {
  // req = incoming request (URL, headers, method, etc.)
  // res = response object used to send data back

  res.end("Hello from the server"); // Ends response and sends data
});

// ======================
// START SERVER
// ======================

// Binds server to IP + port
// 127.0.0.1 = localhost (your machine)
server.listen(8000, "127.0.0.1", () => {
  // Callback runs once when server starts successfully
  console.log("Listening to requests on port 8000");
});
```

---

### 12. Routing

---

```js
const http = require("http");
const url = require("url"); // Used for parsing URL (not fully utilised here)

// ======================
// CREATE SERVER
// ======================

const server = http.createServer((req, res) => {
  // req.url contains path + query string (e.g. /product?id=1)
  const pathName = req.url;

  // ======================
  // ROUTING
  // ======================

  if (pathName === "/" || pathName === "/overview") {
    // Default / overview route
    res.end("This is the overview");
  } else if (pathName === "/product") {
    // Product route (no dynamic handling yet)
    res.end("This is the product");
  } else {
    // ======================
    // ERROR HANDLING
    // ======================

    // Send status code + headers BEFORE response body
    res.writeHead(404, {
      "Content-type": "text/html", // Browser interprets as HTML
      "my-own-header": "hello-world", // Custom header (debug/demo)
    });

    res.end("<h1>Error 404</h1>");
  }
});

// ======================
// START SERVER
// ======================

// Binds to localhost:8000
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});

// ======================
// KEY POINTS
// ======================

// - Simple manual routing via req.url (no framework)
// - No parsing → query params ignored (url module unused)
// - res.writeHead sets status + headers (must come before res.end)
// - All logic runs per request (event-driven)
// - Lacks scalability → better handled with routing libs/frameworks (e.g. Express)
```

---

### 13. Building a (Very) Simple API

---

Creates a basic Node.js HTTP server that preloads JSON data once, uses simple manual routing based on req.url, and returns either plain text or the JSON response, but lacks URL parsing, dynamic handling, and proper header consistency.

```js
const http = require("http");
const url = require("url"); // Intended for parsing URL (currently unused)
const fs = require("fs");

// ======================
// LOAD DATA (ONCE)
// ======================

// Synchronous read at startup → blocks only once (acceptable here)
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");

// Parse JSON into JS object (currently unused in routing)
const dataObj = JSON.parse(data);

// ======================
// CREATE SERVER
// ======================

const server = http.createServer((req, res) => {
  // req.url includes path + query (e.g. /api?id=1)
  const pathName = req.url;

  // ======================
  // ROUTING
  // ======================

  if (pathName === "/" || pathName === "/overview") {
    // Basic route → no headers set (defaults to text/plain)
    res.end("This is the overview");
  } else if (pathName === "/product") {
    // Static response → no dynamic product handling yet
    res.end("This is the product");
  } else if (pathName === "/api") {
    // Sends preloaded JSON data (no file read per request → efficient)
    res.writeHead(200, { "Content-type": "application/json" }); // Should be "Content-Type"
    res.end(data); // Sends raw JSON string
  } else {
    // ======================
    // 404 HANDLER
    // ======================

    res.writeHead(404, {
      "Content-type": "text/html", // Should be "Content-Type"
      "my-own-header": "hello-world", // Custom header (demo/debug)
    });

    res.end("<h1>Error 404</h1>");
  }
});

// ======================
// START SERVER
// ======================

// Runs locally on 127.0.0.1:8000
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
```

---

### 14. HTML Templating: Building the Templates

---

```js
// Core Node modules
const http = require("http"); // Creates the web server
const url = require("url"); // Parses URL path + query string
const fs = require("fs"); // Reads local files

// Custom helper function for replacing placeholders in HTML templates
const replaceTemplate = require("./modules/replaceTemplate");

// ======================
// LOAD TEMPLATES + DATA ONCE
// ======================

// These files are read once when the app starts.
// Better than reading them inside the request callback every time.
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8",
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8",
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8",
);

// Raw JSON string used for the API response
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");

// Parsed JS object used for generating dynamic HTML
const dataObj = JSON.parse(data);

// ======================
// CREATE SERVER
// ======================

const server = http.createServer((req, res) => {
  // Parses URL into pathname and query object
  // Example: /product?id=2
  // pathname = "/product"
  // query = { id: "2" }
  const { query, pathname } = url.parse(req.url, true);

  // ----------------
  // OVERVIEW PAGE
  // ----------------
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    // Create one HTML card per product
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    // Insert all product cards into the overview template
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // ----------------
    // PRODUCT PAGE
    // ----------------
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });

    // query.id selects a product from the data array
    // Example: /product?id=0 → first product
    const product = dataObj[query.id];

    // Fill product template with selected product data
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // ----------------
    // API ROUTE
    // ----------------
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });

    // Sends original JSON string directly to the browser/client
    res.end(data);

    // ----------------
    // 404 ROUTE
    // ----------------
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });

    res.end("<h1>Error 404</h1>");
  }
});

// ======================
// START SERVER
// ======================

// Server listens locally on port 8000
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
```

---

### 19. Types of Packages and Installs

---

Standard dependency that is required to run the project

```bash
npm i slugify
```

dev dependency just for dev production, not critical

```bash
npm i nodemon -save-dev
```

install dependency globally, best to do dev

```bash
npm i nodemon --global
```

change this >

```json
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
```

for dev projects

```bash
npm run dev
```

---

# Section 3: Introduction to Back-End Web Development

---

### 25. An Overview of How the Web Works

---

1. request is made to DNS Lookup, then it responds it >

- Protocol: HTTP or HTTPS
- IP Address
- Port Number: Default 443 for HTTPS, 80 for HTTP

2. Connection is made via TCP/IP Socker connection to the server as well as HTTP.
3. Types of HTTP connections: GET, POST, PUT

```json
GET /maps HTTP/1.1 // Start line: HTTP method + request target + HTTP Version
Host: www.google.com // HTTP request headers
User-Agent: Mozilla/5.0
Accept-Language: en-US

<BODY> // Request body (only when sending data to server e.g. POST)
```

4. HTTP Response

```json
HTTP/1.1 200 OK // Start line: HTTP Version + status code + status message

DATE: Fri, 18 Jan 2021 // HTTP response headers
Content-Type: text/html
Transfer-Encoding: chunked

<BODY> // Response body
```

5. Rendering

- index.html is the first to be loaded >
- Scanend for assets: JS, CSS, images >
- Process is repeated for each file

---

# Section 4: How Node.js Works: A Look Behind the Scenes

---

### 30. Node, V8, Libuv and C++

---

Node is built on top of the V8 engine which is built by Google
Also, it's built on libuv which does event loop (threading) and thread pool (File access)

Also, other tools

- http-parser
- c-ares
- OpenSLL
- zlib

---

### 31. Processes, Threads and the Thread Pool

---

NODE.JS Process (Instance of a program in execution on a computer) >
Single Thread (Sequence pf instructions) >

1. Initialize the program
2. Execute top-level code
3. Load/require modules
4. Register event callbacks
5. Start the Event Loop

The Event Loop handles asynchronous callbacks, such as:

```js
setTimeout();
fs.readFile();
server.on("request");
```

It allows Node.js to handle many operations without blocking the main thread.

Some expensive tasks are offloaded to the libuv thread pool, including:

- File system operations
- Cryptography
- Compression
- DNS lookup

---

# 32. The Node.js Event Loop

---

All the application code that is inside callback functions (non-top-level-code)
Node.js is built around callback functions

Event driven architecture

- Events are emitted
- Event loop picks them up
- Callbacks are called

example

Start:

```js
const fs = require("fs");

console.log("1. Top-level code starts");

setTimeout(() => {
  console.log("5. Timers phase: setTimeout callback");
}, 0);

setImmediate(() => {
  console.log("7. Check phase: setImmediate callback");
});

fs.readFile(__filename, "utf8", () => {
  console.log("6. Poll phase: I/O callback from fs.readFile");

  setImmediate(() => {
    console.log("8. Check phase: setImmediate inside I/O");
  });

  setTimeout(() => {
    console.log("9. Timers phase: setTimeout inside I/O");
  }, 0);
});

process.nextTick(() => {
  console.log("3. Microtask: process.nextTick");
});

Promise.resolve().then(() => {
  console.log("4. Microtask: Promise.then");
});

console.log("2. Top-level code ends");
```

---

### 33. The Event Loop in Practice

---

```js
const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 2;

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O Finished");
});

crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
  console.log(Date.now() - start, "password ");
});
crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
  console.log(Date.now() - start, "password ");
});
crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
  console.log(Date.now() - start, "password ");
});
crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
  console.log(Date.now() - start, "password ");
});

console.log("Hello from the top-level code");
```

1. Top-level code runs first
2. setTimeout waits for timers phase
3. setImmediate waits for check phase
4. fs.readFile runs through I/O / poll phase
5. pbkdf2 uses the libuv thread pool

---

### 34. Events and Event-Driven Architecture

---

Event Emitter → emits event → Listener → executes callback

Doorbell (event) → You hear it (listener) → You open door (callback)

1. Client hits: http://127.0.0.1:8000
1. Server emits: "request" event
1. Listener (server.on) catches it
1. Callback executes
1. Response is sent

```js
const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Response sent");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server running on port 8000");
});
```

Another example

```js
const EventEmitter = require("events");

const myEmitter = new EventEmitter();

myEmitter.on("greet", (name) => {
  console.log(`Hello ${name}`);
});

myEmitter.emit("greet", "John");
```

Real world example

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

function createOrder(order) {
  saveToDB(order);
  emitter.emit("orderCreated", order);
}

// listeners
emitter.on("orderCreated", sendEmail);
emitter.on("orderCreated", updateDashboard);
```

---

### 35. Events in Practice

---
