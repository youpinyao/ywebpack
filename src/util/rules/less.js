const style = require('./style');

module.exports = (config, modules) => {
  const isDev = config.env === 'development';

  return {
    test: /\.less$/,
    exclude: modules === false ? undefined : [/(node_modules)/].concat(config.cssModulesExclude || []),
    include: modules === false ? [/(node_modules)/].concat(config.cssModulesExclude || []) : undefined,
    use: style(config, 'less', modules),
  }
}
