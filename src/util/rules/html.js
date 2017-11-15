module.exports = () => {
  return {
    test: /\.html$/,
    exclude: /(node_modules)/,
    use: [{
      loader: 'html-loader',
      options: {
        interpolate: true,
        ignoreCustomFragments: [/\{\{.*?}}/],
        attrs: ['img:src', 'link:href', 'audio:src', 'video:src', 'script:src', 'div:data-src'],
        minimize: false
      }
    }]
  }
};
