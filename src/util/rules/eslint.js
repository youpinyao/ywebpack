module.exports = (config, include) => {
  return {
    test: /\.js?$/,
    enforce: 'pre',
    loader: 'eslint-loader',
    exclude: include ? undefined : config.babelEslintExclude || '/(node_modules)/',
    include,
  };
};
