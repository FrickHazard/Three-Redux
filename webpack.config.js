const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.tsx' ]
  },
  devServer: {
    contentBase: './bin'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'bin')
  },
};