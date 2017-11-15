const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const modules = require('./util/modules');
const config = require('./config');

const plugins = [
  // 输出 css
  new ExtractTextPlugin(path.resolve(process.cwd(), '.dll/[name].dll.css')),
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
    name: '[name]_library'
  })
];

module.exports = function () {
  return {
    entry: {
      vendor: [path.resolve(process.cwd(), config.vendor)]
    },
    output: {
      path: path.resolve(process.cwd(), '.dll'),
      filename: '[name].dll.js',
      /**
       * output.library
       * 将会定义为 window.${output.library}
       * 在这次的例子中，将会定义为`window.vendor_library`
       */
      library: '[name]_library'
    },
    module: modules({}),
    plugins,
  };
};
