const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const WebpackChunkHash = require('webpack-chunk-hash');
const WorkboxPlugin = require('workbox-webpack-plugin');

const html = require('./html');

const workboxVersion = require('workbox-webpack-plugin/package.json').version;

const serviceWorkerPath = path.resolve(process.cwd(), 'service-worker.js');

module.exports = (config) => {
  let hash = config.env === 'development' ? '.[hash]' : '.[contenthash]';

  if (config.hash === false) {
    hash = '';
  }
  if (typeof config.hash === 'string') {
    // eslint-disable-next-line
    hash = config.hash;
  }

  const plugins = [
    new webpack.ProvidePlugin({
      _: 'underscore',
      Promise: 'promise',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ProgressBarPlugin({
      // format: `build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds) \r\n`,
      format: `build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
      clear: true,
    }),
    new webpack.NamedModulesPlugin(),
  ].concat(html(config));

  if (config.swOptions) {
    if (!fs.existsSync(serviceWorkerPath)) {
      fs.writeFileSync(
        serviceWorkerPath,
        fs
          .readFileSync(path.resolve(__dirname, '../template/service-worker.js'))
          .toString()
          .replace(/{{version}}/g, workboxVersion),
      );
    } else if (fs.readFileSync(serviceWorkerPath).toString().indexOf(`@${workboxVersion}`) === -1) {
      throw new Error('please delete service-worker.js in the process cwd path and restart ywebpack');
    }
    const defaultSwOptions = {
      swSrc: serviceWorkerPath,
      swDest: 'service-worker.js',
      importWorkboxFrom: 'disabled',
      exclude: [/\.html$/],
    };

    // plugins.push(new WorkboxPlugin.GenerateSW({
    //   ...defaultSwOptions,
    //   ...(config.swOptions === true ? {} : config.swOptions),
    // }));

    plugins.push(new WorkboxPlugin.InjectManifest({
      ...defaultSwOptions,
      ...(config.swOptions === true ? {} : config.swOptions),
    }));
  }

  if (config.env === 'production') {
    plugins.push(new MiniCssExtractPlugin({
      filename: `[name]${hash}.css`,
      chunkFilename: `[name]${hash}.css`,
    }));
  }
  if (config.bundleAnalyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
};
