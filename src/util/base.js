const path = require('path');
const webpack = require('webpack');

const plugins = require('./plugins');
const entry = require('./entry');
const modules = require('./modules');

module.exports = function (config) {
  let hash = '.[hash]';

  if (config.hash === false) {
    hash = '';
  }
  if (typeof config.hash === 'string') {
    hash = config.hash;
  }

  return {
    mode: config.env,
    cache: true,
    entry: entry(config),
    output: {
      filename: `[name]${hash}.js`,
      publicPath: config.publicPath,
      path: path.resolve(process.cwd(), config.path),
      sourceMapFilename: `[name]${hash}.map`
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.jsx'],
      modules: ['node_modules']
    },
    module: modules(config),
    plugins: plugins(config),
  };
};
