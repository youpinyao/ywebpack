const html = require('./rules/html');
const css = require('./rules/css');
const sass = require('./rules/sass');
const less = require('./rules/less');
const eslint = require('./rules/eslint');
const babel = require('./rules/babel');
const assets = require('./rules/assets');
const isWindow = require('./isWindow');

module.exports = function (config) {
  const modules = {
    rules: [
      html(config),
      css(config),
      css(config, false),
      sass(config),
      sass(config, false),
      less(config),
      less(config, false),
      babel(config),
      eslint(config),
      assets(config),
    ]
  };

  // 如果某些的特定的依赖需要同项目一样构建
  if (config.buildInclude) {

    if (isWindow) {
      config.buildInclude = config.buildInclude.replace(/\//g, '\\');
    }

    config.buildInclude = new RegExp(config.buildInclude);

    modules.rules.push(html(config, config.buildInclude));
    modules.rules.push(css(config, undefined, config.buildInclude));
    modules.rules.push(sass(config, undefined, config.buildInclude));
    modules.rules.push(less(config, undefined, config.buildInclude));
    modules.rules.push(babel(config, config.buildInclude));
    modules.rules.push(eslint(config, config.buildInclude));
    modules.rules.push(assets(config, config.buildInclude));
  }

  if (config.env === 'development') {
    // 如果是调试，对调试依赖也进行babel
    modules.rules.push(babel(config, /(\/webpack)/));
  }

  return modules;
};
