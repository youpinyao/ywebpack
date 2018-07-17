module.exports = (config, include) => {
  return {
    test: /\.(jpg|png|gif|woff|woff2|eot|ttf|svg|ico|mp3|mp4|pdf)$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use: [{
      loader: 'url-loader',
      options: Object.assign({
        name: '[name].[hash].[ext]',
        limit: 10000
      }, config.urlOptions)
    }]
  }
};
