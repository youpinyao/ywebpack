module.exports = (config, include) => {
  return {
    test: /\.html$/,
    exclude: include ? undefined : /(node_modules)/,
    include,
    use: [{
      loader: 'html-loader',
      options: Object.assign({
        interpolate: true,
        ignoreCustomFragments: [/\{\{.*?}}/],
        attrs: ['img:src', 'link:href', 'audio:src', 'video:src', 'script:src', 'div:data-src'],
        minimize: false,
      }, config.htmlOptions),
    }]
  }
};
