const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const WebpackChunkHash = require('webpack-chunk-hash');
const html = require('./html');

module.exports = (config) => {
  let hash = '.[hash]';

  if (config.hash === false) {
    hash = '';
  }
  if (typeof config.hash === 'string') {
    hash = config.hash;
  }

  const plugins = [
    new webpack.ProvidePlugin({
      _: 'underscore',
      'Promise': 'promise',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ProgressBarPlugin(),
    new webpack.NamedModulesPlugin(),
  ].concat(html(config));

  if (config.env === 'production') {
    plugins.push(new MiniCssExtractPlugin({
      filename: `[name]${hash}.css`,
      chunkFilename: `[name]${hash}.css`,
    }));
  }

  return plugins;
}
