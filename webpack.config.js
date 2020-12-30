// Main imports | DON'T CHANGE
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
var webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

const pkg = require('./package.json');

// Project related settings
const ENV = process.env.NODE_ENV || 'development';
const dist = './dist';
const port = 8080;

// Webpack configuration | DON'T CHANGE

module.exports = {
  entry: {
    main: './src/index.js'
  },
  mode: ENV,
  output: {
    path: path.join(__dirname, dist),
    filename: 'bundle.js',
    chunkFilename: 'bundle.[chunk].js'
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env')
    }),
    new WebpackNotifierPlugin({
      title: pkg.displayName,
      alwaysNotify: true
    }),
    new HtmlWebpackPlugin({
      title: pkg.displayName,
      template: './src/html/index.html',
    }),
    new Dotenv()
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    fallback: {
      fs: false,
      "path": false,
      "util": false
    }
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    contentBase: path.join(__dirname, dist),
    watchContentBase: true,
    watchOptions: {
      poll: true
    },
    compress: true,
    port: port,
    host: 'localhost',
    hot: true,
    inline: true
  }
};