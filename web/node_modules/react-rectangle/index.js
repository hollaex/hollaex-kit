import Rectangle from './src/rectangle';
// Babel 6 exports es6 defaults as `exports["default"] = default`, not as `module.exports = default`, which is correct in terms of es6, but confusing for people using commonjs and used to the babel 5 wrong behavior. Since we are exporting ONLY the default export from our package it makes sence to simulate the old behavior.
module.exports = Rectangle;
