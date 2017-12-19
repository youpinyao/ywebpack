module.exports = () => {
  return {
    test: /\.(jpg|png|gif|woff|woff2|eot|ttf|svg|ico|mp3|mp4)$/,
    exclude: /(node_modules)/,
    use: [{
      loader: 'url-loader',
      options: {
        name: '[name].[hash].[ext]',
        limit: 10000
      }
    }]
  }
};
