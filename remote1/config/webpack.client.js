const path = require('node:path');
const { merge } = require('webpack-merge');
const sharedWebpackConfig = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');

module.exports = merge(sharedWebpackConfig, {
  name: 'client',
  // target: 'web',

  entry: {},

  // entry: {
  //   resourceQueries: [
  //     './remote-delegate.js?remote=remote2@http://localhost:3004/client/remoteEntry.js',
  //     './remote-delegate.js?remote=remote2@http://localhost:3004/server/remoteEntry.js',
  //   ],
  // },

  // entry: [
  //   './remote-delegate.js?remote=remote2@http://localhost:3004/client/remoteEntry.js',
  //   './remote-delegate.js?remote=remote2@http://localhost:3004/server/remoteEntry.js',
  // ],

  // entry: [
  //   // todo: we need this to have a resourceEntry
  //   './remote-delegate.js?remote=remote2@http://localhost:3004/remoteEntry.js',
  // ],

  // entry: [
  //   './src/print.js',
  //   './remote-delegate.js?remote=remote2@http://localhost:3004/remoteEntry.js',
  // ],

  output: {
    path: path.resolve(__dirname, '../dist/client'),
    publicPath: 'http://localhost:3002/client/',
  },

  optimization: {
    minimize: false,
  },

  resolve: {
    // note: @module-federation/utilities needs a path for browser it seems
    fallback: { path: require.resolve('path-browserify') },
  },

  plugins: [...moduleFederationPlugin.client],
});
