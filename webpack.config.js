const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/scripts/ethio-wds.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/ethio-wds.js',
    library: 'ethioWDS',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false, // Preserve ES6 modules
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                }
              }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};