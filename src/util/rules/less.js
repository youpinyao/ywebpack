const style = require('./style');
const isWindow = require('../isWindow');

module.exports = (config, modules, include) => {
  const use = style(config, 'less', modules);

  if (modules === false) {
    const reg = new RegExp(isWindow ? 'node_modules\\antd' : 'node_modules/antd');
    return {
      test: /\.less$/,
      include: reg,
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
