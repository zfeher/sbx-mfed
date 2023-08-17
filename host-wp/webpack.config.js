const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin =
  require('webpack').container.ModuleFederationPlugin;
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');
const { createDelegatedModule } = require('@module-federation/utilities');

module.exports = {
  // entry: './src/index.js',
  entry: [
    './src/index.js',
    // todo: seems we need this for delegate modules so requestQuery goes into main
    //  bundle and works.
    // todo: we can create a remotes var to help like delegate-modules example but with
    //  createDelegatedModule helper. here we can remove the internal prefix and should work
    // './remote-delegate-v0.js?remote=remote1@http://localhost:3002/remoteEntry.js',
    // './remote-delegate.js?remote=remote1@http://localhost:3002/remoteEntry.js',
    // './remote-delegate.js?remote=remote2@http://localhost:3004/remoteEntry.js',
  ],

  target: 'web',

  output: {
    filename: 'bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: {
    minimize: false,
  },

  resolve: {
    // todo: @module-federation/utilities needs a path for browser it seems
    // fallback: { path: false },
    fallback: { path: require.resolve('path-browserify') },
  },

  plugins: [
    new ModuleFederationPlugin({
      // name: 'host',
      // filename: 'remoteEntry.js',
      // runtime: 'remoteRuntime',
      // library: { name: 'host', type: 'var' },
      // library: { type: 'script' },
      // exposes: {
      //   './print': './src/print.js',
      // },

      remotes: {
        // remote1: 'remote1@http://localhost:3002/remoteEntry.js',
        // remote2: 'remote2@http://localhost:3004/remoteEntry.js',
        // remote1: 'remote2@http://localhost:3004/remoteEntry.js',
        // remote1: 'remote1@[globalThis.remote1Url]/remoteEntry.js',
        remote1: 'remote1@[globalThis.remoteUrls.remote1]',
        // delegate1: 'delegate1@http://localhost:3004/remoteEntry.js',
        // delegate module
        // internal C:\Users\midnite\dev\mito\sbx-mfed\host\remote-delegate.js?remote=remote1@3002
        // remote1: createDelegatedModule(
        //   require.resolve('./remote-delegate.js'),
        //   {
        //     // note: here we can pass anything just the name and let delegate resolve it etc
        //     remote: `remote1@http://localhost:3002/remoteEntry.js`,
        //     // remote: `remote1@3002`,
        //   },
        // ),
      },

      shared: {
        lodash: {
          // eager: true,
          // import: false,
          singleton: true,
          // strictVersion: true,
        },
      },
    }),

    new ExternalTemplateRemotesPlugin(),

    new HtmlWebpackPlugin({
      title: 'Module Federation - Host',
    }),
  ],

  // devtool: 'inline-source-map',
};
