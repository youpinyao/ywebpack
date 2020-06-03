const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const baseConfig = require('./util/base');
const dllConfig = require('./dll');

module.exports = (config) => {
  const optimization = {};
  let dllHash = path.resolve(process.cwd(), `.dll/${dllConfig.getDllHash(config)}.hash`);

  const plugins = [
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: false,
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
      },
    }),
  ];

  if (fs.existsSync(dllHash)) {
    dllHash = fs.readFileSync(dllHash);
  } else {
    dllHash = null;
  }

  if (config.vendors === true || config.vendor === true) {
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

  return webpackMerge(baseConfig(config), {
    plugins,
    optimization,
  }, config.webpackProductionMerge || config.webpackMerge || {}, config);
};
