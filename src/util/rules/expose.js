
module.exports = (config) => {
  return {
    test: require.resolve('promise'),
    use: [{
        loader: 'expose-loader',
        options: 'Promise'
    }]
  }
}
