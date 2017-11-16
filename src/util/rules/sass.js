
const style = require('./style');

module.exports = (config, modules) => {
  const isDev = config.env === 'development';

  return {
    test: /\.scss$/,
    exclude: modules === false ? undefined : /(node_modules)/,
    include: modules === false ? /(node_modules)/ : undefined,
    use: style(config, 'sass', modules),
  }
}
