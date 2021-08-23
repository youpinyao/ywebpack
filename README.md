# ywebpack
针对antd对webpack进行封装，简化。

## 安装
```
npm i ywebpack -D
```

## cli
```
// 调试
ywebpack start <configPath>
// 构建
ywebpack build <configPath>
```

## config
```
//ywebpack.config.js

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
  // 第三方分析插件
  bundleAnalyzer: false,
  folder: false, // 是否把构建后的目录整理成  css, images, js, html
  cssOptions: undefined, // loader
  lessOptions: undefined, // loader
  sassOptions: undefined, // loader 默认为关闭 自行安装node-sass sass-loader
  htmlOptions: undefined, // loader
  urlOptions: undefined, // loader
  htmlPluginOptions: undefined, // html-webpack-plugin
  swOptions: undefined, // workbox InjectManifest config or boolean
  postcssPlugins: [],
  extraBabelPresets: [],
  extraBabelPlugins: [],
  babelPresetsEnvConfig: {}, // https://babeljs.io/docs/en/babel-preset-env
  webpackMerge: {},
  babelEslintExclude: /(node_modules)/,
  afterBuild() {
    console.log('afterBuild');
  },
  afterStart() {
    console.log('afterStart');
  },
  // 对应环境独立webpack的配置
  webpackDevelopmentMerge: {},
  // 对应环境独立webpack的配置
  webpackProductionMerge: {},
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
```

## service worker

```node
config

swOptions: true or InjectManifest config,

add to html head
<script>
// Check that service workers are supported
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
</script>
```

## 注意事项

```node
值得一提的是，如果安装过程出现sass相关的安装错误，请在安装mirror-config-china后重试。

$ npm install -g mirror-config-china
```