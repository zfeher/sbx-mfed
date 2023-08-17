const path = require('node:path');
const { merge } = require('webpack-merge');
const sharedWebpackConfig = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');
const { serverLibrary } = require('./constants');

module.exports = merge(sharedWebpackConfig, {
  name: 'server',
  target: false,
  // target: 'node',
  // target: 'async-node',

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
  //   './src/print.js',
  //   './remote-delegate.js?remote=remote2@http://localhost:3004/remoteEntry.js',
  // ],

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
    library: serverLibrary,
  },

  optimization: {
    minimize: false,
  },

  plugins: [...moduleFederationPlugin.server],
});
