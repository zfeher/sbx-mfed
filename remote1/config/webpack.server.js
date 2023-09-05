const path = require('node:path');
const { merge } = require('webpack-merge');
const sharedWebpackConfig = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');
const { serverLibrary } = require('./constants');

module.exports = merge(sharedWebpackConfig, {
  name: 'server',
  // note: this is recommended for remoteEntry build, works with StreamingTargetPlugin
  target: false,
  // target: 'node',
  // target: 'async-node',

  entry: {},

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    // filename: '[name].js',
    // library: serverLibrary,
  },

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

  plugins: [...moduleFederationPlugin.server],
});
