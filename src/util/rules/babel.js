module.exports = (config, include) => {

  const babelConfig = {
    test: /\.(js|jsx)$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use: [{
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          'env',
          'react',
          'stage-0'
        ],
        plugins: [
          'syntax-dynamic-import',
          'add-module-exports',
          'syntax-async-functions',
          'transform-async-to-generator',
          'syntax-jsx',
          'transform-runtime',
        ]
      }
    }]
  }

  // 如果是生产环境就全部babel
  if (config.env === 'production') {
    babelConfig.exclude = undefined;
    babelConfig.include = undefined;
  }

  if (config.extraBabelPresets) {
    babelConfig.use[0].options.presets = babelConfig.use[0].options.presets.concat(config.extraBabelPresets);
  }
  if (config.extraBabelPlugins) {
    babelConfig.use[0].options.plugins = babelConfig.use[0].options.plugins.concat(config.extraBabelPlugins);
  }

  return babelConfig;
};
