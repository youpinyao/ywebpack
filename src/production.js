const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const baseConfig = require('./util/base');
const dllConfig = require('./dll');

const smp = new SpeedMeasurePlugin();

module.exports = (config) => {
  const optimization = {
    minimize: false,
  };
  let dllHash = path.resolve(process.cwd(), `.dll/${dllConfig.getDllHash(config)}.hash`);

  const plugins = [

  ];

  const smpWrap = wp => (config.speedMeasure ? smp.wrap(wp) : wp);

  if (fs.existsSync(dllHash)) {
    dllHash = fs.readFileSync(dllHash);
  } else {
    dllHash = null;
  }

  if (config.vendors === true || config.vendor === true) {
    optimization.splitChunks = {
      // all, async, and initial
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: 'vendor',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };
  } else if (dllHash && config.vendors !== false && config.vendor !== false) {
    const dllCssPath = path.resolve(process.cwd(), `.dll/vendor.dll.${dllHash}.css`);
    const dllJsPath = path.resolve(process.cwd(), `.dll/vendor.dll.${dllHash}.js`);
    const assets = [];

    if (fs.existsSync(dllJsPath)) {
      assets.push(dllJsPath);
    }
    if (fs.existsSync(dllCssPath)) {
      assets.push(dllCssPath);
    }
    plugins.push(new webpack.DllReferencePlugin({
      context: path.resolve(process.cwd()),
      // eslint-disable-next-line
      manifest: require(path.resolve(process.cwd(), `.dll/vendor.manifest.${dllHash}.json`)),
    }));
    plugins.push(new AddAssetHtmlPlugin(assets.map(filepath => ({
      filepath,
      typeOfAsset: filepath.split('.')[filepath.split('.').length - 1],
      includeSourcemap: false,
      hash: true,
    }))));
  }

  return smpWrap(webpackMerge(baseConfig(config), config.webpackMerge || {}, {
    plugins,
    optimization,
  }));
};
