'use strict'

let webpack = require('webpack')

let config = {
  entry: './index.js',
  output: {
    path: 'bin/',
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
