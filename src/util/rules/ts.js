module.exports = (config, include, cssModules) => {
  // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
  return {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: Object.assign({}, config.tsOptions),
  };
};
