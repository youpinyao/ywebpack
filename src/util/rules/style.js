const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (config, type, modules) => {
  const cssOptions = Object.assign({}, config.cssOptions || {});

  if (modules === false) {
    cssOptions.modules = false;
  }

  const types = {
    css: {
      loader: 'css-loader',
      options: Object.assign(
        {
          sourceMap: config.env === 'development',
          modules: {
            localIdentName: '[local]-[hash:base64:10]',
          },
          localsConvention: 'camelCase',
        },
        cssOptions,
      ),
    },
    less: {
      loader: 'less-loader',
      options: config.lessOptions || undefined,
    },
    sass: {
      loader: 'sass-loader',
      options: config.sassOptions && typeof config.sassOptions !== 'boolean' ? config.sassOptions : undefined,
    },
  };

  const postcss = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
      plugins() {
        return [
          // eslint-disable-next-line
          require('autoprefixer')(),
          ...config.postcssPlugins || [],
        ];
      },
    },
  };

  const use = [types.css, postcss];

  if (modules !== false) {
    use.push('resolve-url-loader');
  }

  if (type !== 'css') {
    use.push(types[type]);
  }

  if (config.env === 'production') {
    return [MiniCssExtractPlugin.loader].concat(use);
  }

  return ['style-loader'].concat(use);
};
