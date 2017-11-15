
const style = require('./style');

module.exports = (config) => {
  return {
    test: /\.css$/,
    exclude: /(node_modules)/,
    use: style(config, 'css'),
  }
}
