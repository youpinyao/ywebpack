const style = require('./style');

module.exports = (config, modules) => {
  const use = style(config, 'sass', modules);

  if (modules === false) {
    return {
      test: /\.sass$/,
      include: /(node_modules)/,
      use,
    }
  }

  if (modules === undefined) {
    return {
      test: /\.sass$/,
      exclude: /(node_modules)/,
      use,
    }
  }

  return {
    test: /\.sass$/,
    include: modules,
    use,
  }
}
