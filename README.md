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
  port: '8080', // devServer端口
  host: '0.0.0.0', // devServer ip
  publicPath: '/', // 访问路径前缀
  path: 'dist', // 构建目录路径
  vendors: ['jquery'], // 需要预构建到dll的依赖
  hash: true, // 是否开启文件hash
  entrys: [{
    template: 'test/index.html', // html 输入
    filename: 'index.html', // html 输出
    entry: 'test/index.js', // 入口js
  }],
  cssOptions: undefined, // css-loader 额外options
  lessOptions: undefined, // less-loader 额外options
  sassOptions: undefined, // sass-loader 额外options
  htmlOptions: undefined, // html-loader 额外options
  urlOptions: undefined, // url-loader 额外options
  extraBabelPresets: [], // babel-loader 额外presets
  extraBabelPlugins: [],// babel-loader 额外plugins
  webpackMerge: {}, // 直接覆盖预设webpack配置
  afterBuild() { // build 后回调，方便构建后处理
    console.log('afterBuild');
  },
  // 对应环境独立的配置
  development: {}, // 对调试进行独立配置
  // 对应环境独立的配置
  production: {}, // 对build进行独立配置
  // 如果某些的特定的依赖需要同项目一样构建，正则表达式
  buildInclude: [{
    include: 'node_modules/antd',
    cssModules: false, // 是否css modules
  }], // 需要对特定依赖进行babel，eslint，loader之类的处理，只能字符串
};

```

## service worker

```node
config

swOption: true,

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