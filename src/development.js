process.traceDeprecation = true;

const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const base = require('./util/base');

module.exports = (config) => {
  const baseConfig = base(config);

  const dllCssPath = path.resolve(process.cwd(), '.dll/vendor.dll.css');
  const dllJsPath = path.resolve(process.cwd(), '.dll/vendor.dll.js');
  const assets = [];

  if (fs.existsSync(dllJsPath)) {
    assets.push(dllJsPath);
  }
  if (fs.existsSync(dllCssPath)) {
    assets.push(dllCssPath);
  }

  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('development')
    //   }
    // }),
  ];

  if (assets.length) {
    plugins.push(new webpack.DllReferencePlugin({
      context: path.resolve(process.cwd()),
      // eslint-disable-next-line
      manifest: require(path.resolve(process.cwd(), '.dll/vendor-manifest.json')),
    }));
    plugins.push(new AddAssetHtmlPlugin(assets.map(filepath => ({
      filepath,
      typeOfAsset: filepath.split('.')[filepath.split('.').length - 1],
      includeSourcemap: false,
      hash: true,
    }))));
  }

  return webpackMerge(
    baseConfig,
    {
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
          errors: true,
        },
        stats: 'errors-only',
        inline: true,
        https: false,
        // https: true,
        watchOptions: {
          poll: true,
        },
        publicPath: baseConfig.output.publicPath,
        compress: true, // Enable gzip compression for everything served:
        watchContentBase: false,
      },
      plugins,
    },
    config.webpackMerge || {},
  );
};
