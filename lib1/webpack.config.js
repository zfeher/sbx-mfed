const path = require('node:path');

module.exports = {
  entry: './src/print.js',
  target: 'web',

  output: {
    filename: 'bundle.js',
    // filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: {
    minimize: false,
  },

  plugins: [],

  // devtool: 'inline-source-map',
};
