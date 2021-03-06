const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (config, type, modules) => {
  const cssOptions = Object.assign({}, config.cssOptions || {});

  if (modules === false) {
    cssOptions.modules = false;
  }

  const types = {
    css: {
      loader: 'css-loader',
      options: Object.assign({
        minimize: config.env !== 'development',
        localIdentName: '[local]-[hash:base64:10]',
        modules: true,
        camelCase: true,
      }, cssOptions)
    },
    less: {
      loader: 'less-loader',
      options: config.lessOptions || undefined,
    },
    sass: {
      loader: 'sass-loader',
      options: config.sassOptions || undefined,
    },
  };

  const postcss = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
      plugins() {
        return [
          require('autoprefixer')({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 8', // doesn't support IE8 anyway
            ]
          })
        ];
      }
    }
  };

  const use = [types.css, postcss];

  if (modules !== false) {
    use.push('resolve-url-loader');
  }

  if (type !== 'css') {
    use.push(types[type]);
  }

  return ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use,
  })
}
