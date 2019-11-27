const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const del = require('delete');
const chalk = require('chalk');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const hasha = require('hasha');
const modules = require('./util/modules');
const base = require('./util/base');

const plugins = (hash) => {
  return [
    // 输出 css
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `[name].dll.${hash}.css`,
      chunkFilename: `[name].dll.${hash}.css`,
    }),
    new webpack.DllPlugin({
      /**
       * path
       * 定义 manifest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      context: path.resolve(process.cwd()),
      path: `.dll/[name].manifest.${hash}.json`,
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可。
       */
      name: `[name]${hash}_library`,
    }),
  ];
};

function getDllHash(config) {
  let hash = [];
  let { vendors } = config;

  if (config.vendor) {
    vendors = config.vendor;
  }

  if (typeof vendors === 'string') {
    vendors = [vendors];
  }

  (vendors || []).forEach((vendor) => {
    let newVendor = '';
    try {
      newVendor = require.resolve(vendor);
      hash.push(hasha.fromFileSync(newVendor, { algorithm: 'md5' }));
    } catch (e) {
      newVendor = path.resolve(process.cwd(), vendor);
      hash.push(hasha.fromFileSync(newVendor, { algorithm: 'md5' }));
    }

    return newVendor;
  });

  hash = hasha(hash.join(','), { algorithm: 'md5' });

  return hash;
}

function getVendors(config) {
  let { vendors } = config;

  if (config.vendor) {
    vendors = config.vendor;
  }

  if (typeof vendors === 'string') {
    vendors = [vendors];
  }

  if (vendors && vendors !== true) {
    vendors = vendors.map((vendor) => {
      let newVendor = '';

      try {
        newVendor = require.resolve(vendor);
      } catch (e) {
        newVendor = path.resolve(process.cwd(), vendor);
      }

      return newVendor;
    });
  } else if (vendors === true || vendors === false) {
    console.log(chalk.yellow('vendors is boolean, just run in production'));
    return false;
  } else {
    // console.log(chalk.red('please config vendors'));
    return false;
  }
  return vendors;
}

module.exports = (config, force = false) => {
  const baseConfig = base(config);
  const name = 'vendor';
  const outputPath = path.resolve(process.cwd(), '.dll');
  const hash = getDllHash(config);
  const vendors = getVendors(config);

  if (!vendors) {
    return false;
  }

  delete baseConfig.entry;
  delete baseConfig.output;
  delete baseConfig.plugins;

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  fs.writeFileSync(path.resolve(outputPath, `${hash}.hash`), hash);

  if (fs.existsSync(path.resolve(outputPath, `${name}.manifest.${hash}.json`)) && force === false) {
    return false;
  }
  if (force === true) {
    del.sync([outputPath], {
      force: true,
    });
  }

  return webpackMerge(
    baseConfig,
    {
      mode: 'production',
      entry: {
        [name]: vendors,
      },
      output: {
        path: outputPath,
        filename: `[name].dll.${hash}.js`,
        publicPath: '/.dll/',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: `[name]${hash}_library`,
      },
      plugins: plugins(hash),
    },
    config.webpackMerge || {},
  );
};

module.exports.getDllHash = getDllHash;
