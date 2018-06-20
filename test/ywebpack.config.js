module.exports = {
  port: '8080',
  host: '0.0.0.0',
  publicPath: '/',
  path: 'dist',
  vendors: ['jquery'],
  hash: true,
  entrys: [{
    template: 'test/index.html',
    filename: 'index.html',
    entry: 'test/index.js',
  }, {
    template: 'test/app.html',
    filename: 'app.html',
    entry: 'test/app.js',
  }],
  cssOptions: undefined,
  lessOptions: undefined,
  sassOptions: undefined,
  htmlOptions: undefined,
  extraBabelPresets: [],
  extraBabelPlugins: [],
  webpackMerge: {},
  afterBuild() {
    console.log('afterBuild');
  },
  // 对应环境独立的配置
  development: {},
  // 对应环境独立的配置
  production: {},
  // 如果某些的特定的依赖需要同项目一样构建，正则表达式
  // buildInclude: undefined,

  buildInclude: [{
    include: '(node_modules/meetyou-antd-base)',
  }, {
    include: '(node_modules/antd)',
    cssModules: false,
  }, {
    include: '(node_modules/lightgallery.js)',
    cssModules: false,
  }],
};
