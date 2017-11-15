module.exports = {
  port: '8080',
  host: 'localhost',
  publicPath: '/',
  path: 'dist',
  vendor: 'test/vendor.js',
  entrys: [{
    template: 'test/index.html',
    filename: 'index.html',
    entry: 'test/index.js',
  }],
  lessOptions: undefined,
  sassOptions: undefined,
  extraBabelPlugins: [],
};
