'use strict'

let webpack = require('webpack')

let config = {
  entry: './src/index.js',
  output: {
    path: 'lib/',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}

module.exports = config
