module.exports = (config, include) => {
  return {
    test: /\.js?$/,
    enforce: 'pre',
    loader: 'eslint-loader',
    exclude: include ? undefined : /(node_modules)/,
    include,
  }
};
