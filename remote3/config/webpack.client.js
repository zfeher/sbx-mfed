const path = require('node:path');
const { merge } = require('webpack-merge');
const sharedWebpackConfig = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');

module.exports = merge(sharedWebpackConfig, {
  name: 'client',
  // target: 'web',

  entry: {},

  output: {
    path: path.resolve(__dirname, '../dist/client'),
    publicPath: 'http://localhost:3006/client/',
  },

  optimization: {
    minimize: false,
  },

  plugins: [...moduleFederationPlugin.client],
});
