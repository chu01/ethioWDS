const path = require('path');

module.exports = {
  entry: './src/js/ethio-wds.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/ethio-wds.js',
    library: 'ethioWDS',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
    clean: false // ⚠️ Change to false to preserve CSS files
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
                modules: false,
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not ie <= 11']
                },
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
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