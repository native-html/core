const name = require('./package.json').name;
const configureRelease = require("release-config");
module.exports = configureRelease(name);
