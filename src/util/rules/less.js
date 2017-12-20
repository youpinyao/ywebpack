const style = require('./style');

module.exports = (config, modules, include) => {
  const use = style(config, 'less', modules);

  if (modules === false) {
    return {
      test: /\.less$/,
      include: /(node_modules\/antd)/,
      use,
    }
  }

  return {
    test: /\.less$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use,
  }
}
