
const style = require('./style');

module.exports = (config, modules) => {
  return {
    test: /\.css$/,
    exclude: modules === false ? undefined : /(node_modules)/,
    include: modules === false ? /(node_modules)/ : undefined,
    use: style(config, 'css', modules),
  }
}
