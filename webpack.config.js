const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: 'app/',
    filename: 'index.js'
  },
  module: {
    loaders: [

{test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass')},
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'es2016', 'es2017']
        }
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?limit=10000!img?progressive=true' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('index.css')
  ]
}
