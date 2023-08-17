const { ModuleFederationPlugin } = require('webpack').container;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require('@module-federation/node');

const { serverLibrary } = require('./constants');

const containerName = 'remote2';
const containerFilename = 'remoteEntry.js';

const exposes = {
  './print': './src/print.js',
  './korte': './src/getKorte.js',
};

const shared = {
  lodash: {
    // eager: true,
    // import: false,
    singleton: true,
    // strictVersion: true,
  },
};

module.exports = {
  client: [
    new ModuleFederationPlugin({
      name: containerName,
      filename: containerFilename,
      remotes: {},
      exposes,
      shared,
    }),
  ],

  server: [
    new NodeFederationPlugin({
      name: containerName,
      filename: containerFilename,
      library: serverLibrary,
      remotes: {},
      exposes,
      shared,
    }),

    new StreamingTargetPlugin({
      name: containerName,
      library: serverLibrary,
      remotes: {},
    }),
  ],
};
