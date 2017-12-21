const os = require('os');

console.log('os:', os.platform());

module.exports = os.platform() === 'win32';
