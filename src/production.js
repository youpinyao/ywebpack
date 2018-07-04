const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./util/base');

module.exports = function (config) {
  const optimization = {};
  const plugins = [
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: false
    }),
    // don't need in webpack4
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production')
    //   }
    // }),

    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 8,
        warnings: false,
        compress: {
          warnings: false,
          drop_debugger: true,
          // drop_console: true,
          pure_funcs: ['console.log'],
        },
        mangle: true,
        output: {
          comments: false,
          beautify: false,
        },
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      }
    })
  ];

  if (config.vendors !== false && config.vendor !== false) {
    // plugins.push( // 输出公共模块
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: ['vendor'],
    //     minChunks(module) {
    //       // this assumes your vendor imports exist in the node_modules directory
    //       return module.context && module.context.indexOf('node_modules') !== -1;
    //     }
    //   }));
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
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }

  return webpackMerge(baseConfig(config), config.webpackMerge || {}, {
    plugins,
    optimization,
  });
};
