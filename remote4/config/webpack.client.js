const path = require('node:path');
const { merge } = require('webpack-merge');
const sharedWebpackConfig = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');

module.exports = merge(sharedWebpackConfig, {
  name: 'client',
  // target: 'web',

  entry: {},

  // entry: { lib: './src/components/Title.jsx' },
  // entry: { lib: './src/printSth.js' },

  output: {
    path: path.resolve(__dirname, '../dist/client'),
    publicPath: 'auto',
    // publicPath: 'http://localhost:3008/client/',
    // library: {
    //   type: 'commonjs-static',
    //   // type: 'commonjs-module',
    //   // type: 'module',
    // },
  },

  resolve: {
    // note: @module-federation/utilities needs a path for browser it seems
    fallback: { path: require.resolve('path-browserify') },
  },

  plugins: [...moduleFederationPlugin.client],
});
