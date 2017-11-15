const style = require('./style');

module.exports = (config) => {
  const isDev = config.env === 'development';

  return {
    test: /\.less$/,
    exclude: /(node_modules)/,
    use: style(config, 'less'),
  }
}
