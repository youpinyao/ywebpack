const html = require('./rules/html');
const css = require('./rules/css');
const sass = require('./rules/sass');
const less = require('./rules/less');
const eslint = require('./rules/eslint');
const babel = require('./rules/babel');
const assets = require('./rules/assets');

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

  // 如果某些的特定的依赖需要css modules 正则表达式
  if(config.cssModulesInclude) {
    modules.rules.push(css(config, config.cssModulesInclude));
    modules.rules.push(sass(config, config.cssModulesInclude));
    modules.rules.push(less(config, config.cssModulesInclude));
  }

  if (config.env === 'development') {
    modules.rules.push(babel(config, true));
  }

  return modules;
};
