var webpack = require('webpack')
var path = require('path')

module.exports = {

  entry: "./src/js/app.js",

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/bundle.js',
  },

  devtool: 'eval',

}
