module.exports = (config, isDevServer) => {

  const babelConfig = {
    test: /\.(js|jsx)$/,
    exclude: isDevServer ? undefined : /(node_modules)/,
    include: isDevServer ? /(\/webpack)/ : undefined,
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

  if (config.extraBabelPlugins) {
    babelConfig.use[0].options.plugins = babelConfig.use[0].options.plugins.concat(config.extraBabelPlugins);
  }

  return babelConfig;
};
