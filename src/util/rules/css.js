const style = require('./style');

module.exports = (config, modules) => {
  const use = style(config, 'css', modules);

  if (modules === false) {
    return {
      test: /\.css$/,
      include: /(node_modules)/,
      use,
    }
  }

  if (modules === undefined) {
    return {
      test: /\.css$/,
      exclude: /(node_modules)/,
      use,
    }
  }

  return {
    test: /\.css$/,
    include: modules,
    use,
  }
}
