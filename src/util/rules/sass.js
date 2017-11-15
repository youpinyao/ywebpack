
const style = require('./style');

module.exports = (config) => {
  const isDev = config.env === 'development';

  return {
    test: /\.scss$/,
    // exclude: /(node_modules)/,
    use: style(config, 'sass'),
  }
}
