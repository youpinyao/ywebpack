module.exports = {
  port: '8080',
  host: 'localhost',
  publicPath: '/',
  path: 'dist',
  vendors: ['jquery', 'moment'],
  hash: true,
  entrys: [{
    template: 'test/index.html',
    filename: 'index.html',
    entry: 'test/index.ts',
  }, {
    template: 'test/app.html',
    filename: 'app.html',
    entry: 'test/app.js',
  }],
  // 第三方分析插件
  bundleAnalyzer: false,
  folder: undefined,
  cssOptions: undefined,
  lessOptions: undefined,
  sassOptions: undefined,
  htmlOptions: undefined,
  urlOptions: undefined,
  extraBabelPresets: [],
  extraBabelPlugins: [],
  babelPresetsEnvConfig: {},
  swOptions: true,
  babelEslintExclude: /(node_modules)/,
  webpackMerge: {
    // resolveLoader: {
    //   modules: ['node_modules', '../'],
    // },
    // module: {
    //   rules: [{
    //     test: /\.(jpg|jpeg|png|gif)$/,
    //     exclude: /(node_modules)/,
    //     use: [
    //       {
    //         loader: 'zhitu-loader',
    //         options: {
    //           quality: 5, // 0 10%, 1 30%, 2 50%, 3  80%, 4 默认, 5 保真
    //           type_change: true, // 自动格式转换
    //           webp: true, // 转webp
    //         },
    //       },
    //     ],
    //   }],
    // },
  },
  afterBuild() {
    console.log('afterBuild');
  },
  // 对应环境独立webpack的配置
  webpackDevelopmentMerge: {},
  // 对应环境独立webpack的配置
  webpackProductionMerge: {},
  // 对应环境独立的配置
  development: {},
  // 对应环境独立的配置
  production: {
    publicPath: './',
  },
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
