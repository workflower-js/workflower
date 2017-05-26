const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { SRC_PATH } = require('./utils')
const base = require('./base')

const dev = {
  devtool: 'source-map',
  devServer: {
    contentBase: [
      path.resolve(__dirname, '../test/'),
      SRC_PATH
    ],
    compress: false,
    port: 8080,
    historyApiFallback: true,
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader', 'autoprefixer?browsers=last 40 versions'],
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_PATH, 'index.html')
    }),
  ]
}

module.exports = merge.smart(base, dev)
