
const style = require('./style');

module.exports = (config, modules) => {
  return {
    test: /\.css$/,
    exclude: modules === false ? undefined : [/(node_modules)/].concat(config.cssModulesExclude || []),
    include: modules === false ? [/(node_modules)/].concat(config.cssModulesExclude || []) : undefined,
    use: style(config, 'css', modules),
  }
}
