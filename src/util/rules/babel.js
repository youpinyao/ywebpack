module.exports = (config, include) => {
  const babelConfig = {
    test: /\.(js|jsx)$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            ['@babel/env', {
              ...config.babelPresetsEnvConfig || {},
            }], '@babel/react'],
          plugins: [
            'syntax-async-functions',
            '@babel/transform-async-to-generator',
            '@babel/syntax-jsx',
            '@babel/transform-runtime',
            '@babel/plugin-transform-modules-commonjs',

            // Stage 0
            '@babel/plugin-proposal-function-bind',

            // Stage 1
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-logical-assignment-operators',
            ['@babel/plugin-proposal-optional-chaining', { loose: false }],
            ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
            ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
            '@babel/plugin-proposal-do-expressions',

            // Stage 2
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-function-sent',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-numeric-separator',
            '@babel/plugin-proposal-throw-expressions',

            // Stage 3
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-syntax-import-meta',
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-json-strings',
          ],
        },
      },
    ],
  };

  // 如果是生产环境就全部babel
  if (config.env === 'production') {
    babelConfig.exclude = /(core-js|babel)/;
    babelConfig.include = undefined;
  }

  if (config.extraBabelPresets) {
    // eslint-disable-next-line
    babelConfig.use[0].options.presets = babelConfig.use[0].options.presets.concat(config.extraBabelPresets);
  }
  if (config.extraBabelPlugins) {
    // eslint-disable-next-line
    babelConfig.use[0].options.plugins = babelConfig.use[0].options.plugins.concat(config.extraBabelPlugins);
  }

  return babelConfig;
};
