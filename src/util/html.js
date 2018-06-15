const HtmlWebpackPlugin = require('html-webpack-plugin');
const name = require('./name');
const path = require('path');

module.exports = (config) => {
  const plugins = [];
  const isDev = config.env === 'development';
  const entrys = config.entrys;

  entrys.forEach(v => {

    const htmlName = name(v.template);
    const jsName = v.name || name(v.entry);
    const chunks = [jsName];

    if (isDev !== true) {
      chunks.push(`vendors~${jsName}`);
    }

    if (htmlName) {
      plugins.push(new HtmlWebpackPlugin({
        title: htmlName,
        minify: false,
        filename: v.filename,
        template: path.resolve(process.cwd(), v.template),
        chunks,
        inject: 'body', // true | 'head' | 'body' | false
      }));
    }
  });

  return plugins;
}
