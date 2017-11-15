const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (config, type) => {

  const types = {
    css: {
      loader: 'css-loader',
      options: {
        minimize: config.env !== 'development'
      }
    },
    less: 'less-loader',
    sass: 'sass-loader',
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

  if (config.env === 'development') {
    return ['style-loader', postcss, 'resolve-url-loader', types[type]];
  }

  return ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [postcss, 'resolve-url-loader', types[type]]
  })
}
