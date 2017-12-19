const style = require('./style');

module.exports = (config, modules) => {
  const use = style(config, 'less', modules);

  if (modules === false) {
    return {
      test: /\.less$/,
      include: /(node_modules)/,
      use,
    }
  }

  if (modules === undefined) {
    return {
      test: /\.less$/,
      exclude: /(node_modules)/,
      use,
    }
  }

  return {
    test: /\.less$/,
    include: modules,
    use,
  }
}
