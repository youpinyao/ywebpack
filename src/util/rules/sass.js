const style = require('./style');

module.exports = (config, modules, include) => {
  const use = style(config, 'sass', modules);

  if (modules === false) {
    return {
      test: /\.sass$/,
      include: /(node_modules\/antd)/,
      use,
    }
  }

  return {
    test: /\.sass$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use,
  }
}
