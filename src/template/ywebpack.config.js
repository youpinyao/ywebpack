module.exports = {
  port: '8080',
  host: 'localhost',
  publicPath: '/',
  path: 'dist',
  // vendors: ['jquery'],
  hash: true,
  entrys: [
    {
      template: 'app/index.html',
      filename: 'index.html',
      entry: 'app/index.js',
    },
  ],
  cssOptions: undefined, // loader
  lessOptions: undefined, // loader
  sassOptions: undefined, // loader
  htmlOptions: undefined, // loader
  urlOptions: undefined, // loader
  htmlPluginOptions: undefined, // html-webpack-plugin
  swOptions: undefined, // service worker
  extraBabelPresets: [],
  extraBabelPlugins: [],
  webpackMerge: {},
  afterBuild() {
    console.log('afterBuild');
  },
  afterStart() {
    console.log('afterStart');
  },
  // 对应环境独立的配置
  development: {},
  // 对应环境独立的配置
  production: {},
  // 如果某些的特定的依赖需要同项目一样构建，正则表达式
  // buildInclude: undefined,

  // buildInclude: [{
  //   include: '(node_modules/antd)',
  //   cssModules: false,
  // }],
};
