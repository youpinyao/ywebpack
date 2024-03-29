const name = require('./name');
const path = require('path');

module.exports = (config) => {
  const entry = {};
  const isDev = config.env === 'development';

  config.entrys.forEach((v) => {
    const jsName = v.name || name(v.entry);

    entry[jsName] = [path.resolve(process.cwd(), v.entry)];

    if (isDev) {
      entry[jsName] = entry[jsName].concat([
        `webpack-dev-server/client?http://${config.host}:${config.port}/`,
        'webpack/hot/dev-server',
      ]);
    }
  });

  return entry;
};
