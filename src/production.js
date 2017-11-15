const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./util/base');
const config = require('./config');

module.exports = function() {
  config.env = 'production';

  return webpackMerge(baseConfig(config), {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: false
      }),

      // 输出公共模块
      new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor'],
        minChunks(module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),

      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        beautify: false,
        comments: false,
        mangle: {
          screw_ie8: false,
          keep_fnames: false
        },
        compress: {
          screw_ie8: false,
          warnings: false
        },
        output: {
          screw_ie8: false
        }
      })
    ]
  });
};
