const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const WebpackChunkHash = require('webpack-chunk-hash');
const html = require('./html');

module.exports = (config) => {
  return [
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
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: config.env === 'development',
      allChunks: true,
    }),
  ].concat(html(config));
}
