const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const modules = require('./util/modules');
const base = require('./util/base');

const plugins = [
  // 输出 css
  new ExtractTextPlugin('[name].dll.css'),
  new webpack.DllPlugin({
    /**
     * path
     * 定义 manifest 文件生成的位置
     * [name]的部分由entry的名字替换
     */
    context: path.resolve(process.cwd()),
    path: '.dll/[name]-manifest.json',
    /**
     * name
     * dll bundle 输出到那个全局变量上
     * 和 output.library 一样即可。
     */
    name: '[name]_library',
  }),
];

module.exports = function (config) {
  const baseConfig = base(config);

  let vendors = config.vendors;

  if (config.vendor) {
    vendors = config.vendor;
  }

  if (typeof vendors === 'string') {
    vendors = [vendors];
  }

  if (vendors) {
    vendors = vendors.map((vendor) => {
      let newVendor = '';

      try {
        newVendor = require.resolve(vendor);
      } catch (e) {
        newVendor = path.resolve(process.cwd(), vendor);
      }

      return newVendor;
    });
  }

  delete baseConfig.entry;
  delete baseConfig.output;
  delete baseConfig.plugins;

  return webpackMerge(baseConfig, {
    mode: 'production',
    entry: {
      vendor: vendors,
    },
    output: {
      path: path.resolve(process.cwd(), '.dll'),
      filename: '[name].dll.js',
      publicPath: '/.dll/',
      /**
       * output.library
       * 将会定义为 window.${output.library}
       * 在这次的例子中，将会定义为`window.vendor_library`
       */
      library: '[name]_library',
    },
    plugins,
  }, config.webpackMerge || {});
};
