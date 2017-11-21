const name = require('./name');
const path = require('path');

module.exports = (config) => {
  const entry = {};
  const isDev = config.env === 'development';

  config.entrys.forEach(v => {
    const jsName = name(v.entry);

    entry[jsName] = [path.resolve(__dirname, './vendor.js'), path.resolve(process.cwd(), v.entry)];

    if (isDev) {
      entry[jsName] = entry[jsName].concat([
        `webpack-dev-server/client?http://${config.host}:${config.port}/`,
        'webpack/hot/dev-server',
      ]);
    }
  });

  return entry;
}
