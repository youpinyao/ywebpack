const style = require('./style');
const isWindow = require('../isWindow');

module.exports = (config, modules, include) => {
  const use = style(config, 'css', modules);

  if (modules === false) {
    const reg = new RegExp(isWindow ? 'node_modules\\antd' : 'node_modules/antd');
    return {
      test: /\.css$/,
      include: reg,
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
