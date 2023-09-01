const path = require('node:path');
const { merge } = require('webpack-merge');
const sharedWebpackConfig = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation.lib');
const { serverLibrary } = require('./constants');

module.exports = merge(sharedWebpackConfig, {
  name: 'server',
  // note: required to be set for lib auth
  target: 'node',
  // target: 'async-node',

  entry: { lib: './src/components/Title.jsx' },
  // entry: { lib: './src/printSth.js' },

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    // filename: '[name].js',
    library: {
      type: 'commonjs-static',
      // type: 'commonjs-module',
    },
  },

  resolve: {
    alias: {
      lib5: 'lib5/lib.server',
    },
  },

  // experiments: {
  //   outputModule: true,
  // },

  externals: {
    react: 'commonjs-static react',
    'react-dom': 'commonjs-static react-dom',
    'react/jsx-dev-runtime': 'commonjs-static react/jsx-dev-runtime',
    'react/jsx-runtime': 'commonjs-static react/jsx-runtime',
    //
    // react: { 'commonjs-module': 'react', module: 'react' },
    // 'react-dom': {
    //   'commonjs-module': 'react-dom',
    //   module: 'react-dom',
    // },
    // 'react/jsx-dev-runtime': {
    //   'commonjs-module': 'react/jsx-dev-runtime',
    //   module: 'react/jsx-dev-runtime',
    // },
    // 'react/jsx-runtime': {
    //   'commonjs-module': 'react/jsx-runtime',
    //   module: 'react/jsx-runtime',
    // },
  },

  optimization: {
    minimize: false,
  },

  plugins: [...moduleFederationPlugin.server],
});
