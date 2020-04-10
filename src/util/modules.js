const html = require('./rules/html');
const css = require('./rules/css');
const sass = require('./rules/sass');
const less = require('./rules/less');
const eslint = require('./rules/eslint');
const babel = require('./rules/babel');
const assets = require('./rules/assets');
const ts = require('./rules/ts');
const isWindow = require('./isWindow');

module.exports = (config) => {
  const modules = {
    rules: [
      html(config),
      css(config),
      less(config),
      babel(config),
      eslint(config),
      assets(config),
      ts(config),
    ],
  };

  if (config.sassOptions) {
    modules.rules.push(sass(config));
  }

  // 如果某些的特定的依赖需要同项目一样构建
  if (config.buildInclude) {
    let { buildInclude } = config;
    if (typeof buildInclude === 'string') {
      buildInclude = [
        {
          include: buildInclude,
        },
      ];
    }

    buildInclude.forEach((item) => {
      let { include } = item;
      const { cssModules } = item;

      if (isWindow) {
        include = include.replace(/\//g, '\\\\');
      }

      include = new RegExp(include);

      modules.rules.push(html(config, include));
      modules.rules.push(css(config, include, cssModules));
      if (config.sassOptions) {
        modules.rules.push(sass(config, include, cssModules))
      }
      modules.rules.push(less(config, include, cssModules));
      modules.rules.push(babel(config, include));
      modules.rules.push(eslint(config, include));
      modules.rules.push(assets(config, include));
      modules.rules.push(ts(config, include));
    });
  }

  if (config.env === 'development') {
    // 如果是调试，对调试依赖也进行babel
    // const reg = new RegExp(isWindow ? '(\\\\webpack)' : '(/webpack)');
    // modules.rules.push(babel(config, reg));
  }

  return modules;
};
