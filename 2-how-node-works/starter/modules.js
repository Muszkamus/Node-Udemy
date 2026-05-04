// console.log(arguments);
// console.log(require("module").wrapper); // '(function (exports, require, module, __filename, __dirname) { ','\n});'

// module.exports
const C = require("./test-module1");
const calc1 = new C();
console.log(calc1.add(2, 5));

// exports
// exports.add = (a, b) => a + b;
const { add, multiply } = require("./test-module2");
console.log(add(2, 10));

// cache

// console.log("Hello from the module");
// module.exports = () => console.log("Log this text 😁");
require("./test-module3")();
require("./test-module3")();
require("./test-module3")();

// Output

// Hello from the module
// Log this text 😁
// Log this text 😁
// Log this text 😁
