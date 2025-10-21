const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/ethio-wds.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/ethio-wds.js',
    library: 'ethioWDS',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
    clean: true // Clean output directory before emit
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
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/ethio-wds.css'
    })
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      // Optional: Create aliases for easier imports
      '@components': path.resolve(__dirname, 'src/js/components/'),
      '@utils': path.resolve(__dirname, 'src/js/utils/')
    }
  },
  externals: {
    // If you want to exclude certain dependencies from the bundle
    // 'some-dependency': 'someDependency'
  }
};