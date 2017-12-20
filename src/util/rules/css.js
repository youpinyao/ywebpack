const style = require('./style');

module.exports = (config, modules, include) => {
  const use = style(config, 'css', modules);

  if (modules === false) {
    return {
      test: /\.css$/,
      include: /(node_modules\/antd)/,
      use,
    }
  }

  return {
    test: /\.css$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use,
  }
}
