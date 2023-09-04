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
    publicPath: 'auto',
    // publicPath: 'http://localhost:3002/client/',
  },

  // experiments: {
  //   outputModule: true,
  // },

  resolve: {
    // note: @module-federation/utilities needs a path for browser it seems
    fallback: { path: require.resolve('path-browserify') },
  },

  optimization: {
    minimize: false,
  },

  plugins: [...moduleFederationPlugin.client],
});
