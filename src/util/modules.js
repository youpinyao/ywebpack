const html = require('./rules/html');
const css = require('./rules/css');
const sass = require('./rules/sass');
const less = require('./rules/less');
const eslint = require('./rules/eslint');
const babel = require('./rules/babel');
const assets = require('./rules/assets');

module.exports = function (config) {
  return {
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
};
