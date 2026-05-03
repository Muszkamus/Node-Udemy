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
