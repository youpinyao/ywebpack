const style = require('./style');
const isWindow = require('../isWindow');

module.exports = (config, modules, include) => {
  const use = style(config, 'sass', modules);

  if (modules === false) {
    const reg = new RegExp(isWindow ? 'node_modules\\\\antd' : 'node_modules/antd');
    return {
      test: /\.scss$/,
      include: reg,
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
