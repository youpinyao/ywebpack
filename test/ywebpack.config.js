module.exports = {
  port: '8080',
  host: 'localhost',
  publicPath: '/',
  path: 'dist',
  vendors: ['jquery'],
  entrys: [{
    template: 'test/index.html',
    filename: 'index.html',
    entry: 'test/index.js',
  }],
  lessOptions: undefined,
  sassOptions: undefined,
  extraBabelPlugins: [],
  webpackMerge: {},
};
