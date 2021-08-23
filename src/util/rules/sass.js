const style = require('./style');

module.exports = (config, include, cssModules) => {
  const use = style(config, 'sass', cssModules);

  return {
    test: /\.scss$/,
    exclude: include ? undefined : config.moduleExclude,
    include,
    use,
  };
};
