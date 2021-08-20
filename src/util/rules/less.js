const style = require('./style');

module.exports = (config, include, cssModules) => {
  const use = style(config, 'less', cssModules);

  return {
    test: /\.less$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use,
  };
};
