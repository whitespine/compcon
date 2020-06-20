const path = require('path');

module.exports = {
  entry: './api.ts',
  devtool: 'inline-source-map',
  optimization: { minimize: false },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'api.js',
    path: path.resolve(__dirname, '..', 'lambda'),
    libraryTarget: "commonjs"
  },
};