module.exports = (config, include) => {
  return {
    test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg|ico|mp3|mp4|pdf)$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use: [
      {
        loader: 'url-loader',
        options: Object.assign(
          {
            name: config.hash === false && config.hashImage !== true ? '[name].[ext]' : '[name].[hash].[ext]',
            limit: 1024 * 3,
          },
          config.urlOptions,
        ),
      },
    ],
  };
};
