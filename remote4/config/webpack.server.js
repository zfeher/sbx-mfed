const path = require('node:path');
const { merge } = require('webpack-merge');
const sharedWebpackConfig = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');
const { serverLibrary } = require('./constants');

module.exports = merge(sharedWebpackConfig, {
  name: 'server',
  // note: recommended for remote entry creation
  target: false,

  // note: required to be set for lib auth
  // target: 'node',
  // target: 'async-node',

  entry: {},

  // entry: { lib: './src/components/Title.jsx' },
  // entry: { lib: './src/printSth.js' },

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
    // library: {
    //   type: 'commonjs-static',
    //   // type: 'commonjs-module',
    // },
  },

  // experiments: {
  //   outputModule: true,
  // },

  /*
   * related: https://github.com/module-federation/universe/tree/nextjs-mf-7.0.7/packages/nextjs-mf/src/internal.ts
   *
   * note: Next won't share modules with `import: false` instead these dependencies
   *  can be required/imported when render runs on server side.
   */
  externals: {
    ...['next/router', 'react', 'react-dom', 'react/jsx-runtime'].reduce(
      (acc, dep) => {
        acc[dep] = `commonjs-static ${dep}`;
        return acc;
      },
      {},
    ),
  },

  optimization: {
    minimize: false,
  },

  plugins: [...moduleFederationPlugin.server],
});
