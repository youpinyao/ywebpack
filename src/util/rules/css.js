const style = require('./style');

module.exports = (config, include, cssModules) => {
  const use = style(config, 'css', cssModules);

  return {
    test: /\.css$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use,
  }
}
