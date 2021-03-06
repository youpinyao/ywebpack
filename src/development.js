process.traceDeprecation = true;

const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const base = require('./util/base');

module.exports = function (config) {
  const baseConfig = base(config);

  const dllCssPath = '.dll/vendor.dll.css';
  const dllJsPath = '.dll/vendor.dll.js';
  const assets = [];

  if (fs.existsSync(dllJsPath)) {
    assets.push(dllJsPath);
  }
  if (fs.existsSync(dllCssPath)) {
    assets.push(dllCssPath);
  }

  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackIncludeAssetsPlugin({
      assets,
      append: false,
      publicPath: '/',
      hash: true,
    }),


    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
  ];

  if (assets.length) {
    plugins.push(new webpack.DllReferencePlugin({
      context: path.resolve(process.cwd()),
      manifest: require(path.resolve(process.cwd(), '.dll/vendor-manifest.json'))
    }));
  }

  return webpackMerge(baseConfig, {
    devtool: 'cheap-eval-source-map',
    devServer: {
      disableHostCheck: true,
      port: config.port,
      host: config.host,
      hot: true,
      noInfo: true,
      quiet: false,
      overlay: {
        warnings: true,
        errors: true
      },
      stats: 'errors-only',
      inline: true,
      https: false,
      // https: true,
      watchOptions: {
        poll: true
      },
      publicPath: baseConfig.output.publicPath,
      compress: true, // Enable gzip compression for everything served:
      watchContentBase: false,
    },
    plugins,
  }, config.webpackMerge || {});
};
