const path = require('path');
const webpack = require('webpack');

const plugins = require('./plugins');
const entry = require('./entry');
const modules = require('./modules');

module.exports = (config) => {
  let hash = config.env === 'development' ? '.[hash]' : '.[contenthash]';

  if (config.hash === false) {
    hash = '';
  }
  if (typeof config.hash === 'string') {
    // eslint-disable-next-line
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
      sourceMapFilename: `[name]${hash}.map`,
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.jsx'],
      modules: ['node_modules'],
    },
    module: modules(config),
    plugins: plugins(config),
  };
};
