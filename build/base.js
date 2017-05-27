const path = require('path')
const {SRC_PATH, DIST_PATH, TEST_PATH} = require('./utils')

module.exports = {
  entry: {
    main: path.resolve(SRC_PATH, 'main')
  },
  output: {
    path: DIST_PATH,
    filename: 'workflower.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': SRC_PATH,
    }
  },
  module: {
    rules: [
      {
        test: /\.[je]s[x]?$/,
        use: ['babel-loader'],
        include: [ SRC_PATH ]
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'autoprefixer-loader?browsers=last 40 versions', 'sass-loader'],
        include: [ SRC_PATH ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'autoprefixer-loader?browsers=last 40 versions', 'less-loader'],
        include: [ SRC_PATH ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [ SRC_PATH ],
        query: {
          limit: 1024,
          name: 'img/[hash:7].[ext]'
        }
      }
    ]
  },
}
