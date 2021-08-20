const HtmlWebpackPlugin = require('html-webpack-plugin');
const name = require('./name');
const path = require('path');

module.exports = (config) => {
  const plugins = [];
  const isDev = config.env === 'development';
  const htmlPluginOptions = config.htmlPluginOptions || {};
  const { entrys } = config;

  const getOtherChunks = (targetName) => {
    const chunks = [];
    entrys.forEach((v) => {
      const jsName = v.name || name(v.entry);
      if (jsName !== targetName) {
        chunks.push(jsName);
      }
    });
    return chunks;
  };

  entrys.forEach((v) => {
    const htmlName = name(v.template);
    const jsName = v.name || name(v.entry);

    if (htmlName) {
      plugins.push(new HtmlWebpackPlugin({
        title: htmlName,
        minify: false,
        filename: v.filename,
        template: path.resolve(process.cwd(), v.template),
        excludeChunks: getOtherChunks(jsName),
        inject: 'body', // true | 'head' | 'body' | false
        ...htmlPluginOptions,
      }));
    }
  });

  return plugins;
};
