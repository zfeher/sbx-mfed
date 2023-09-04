const { ModuleFederationPlugin } = require('webpack').container;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require('@module-federation/node');

const { serverLibrary, defaultShareScope } = require('./constants');

const containerName = 'remote2';
const containerFilename = 'remoteEntry.js';

const exposes = {
  './button': './src/components/Button.jsx',
  './title': './src/components/Title.jsx',
};

const remotes = (isServer) => {
  const webpackLocation = isServer ? 'server' : 'client';
  return {};
};

const shared = (isServer) => {
  return {
    ...defaultShareScope(isServer),

    // lodash: {
    //   singleton: true,
    //   // strictVersion: true,
    //   // eager: isServer ? undefined : true,
    //   // import: false,
    //   // import: isServer ? false : undefined,
    // },
  };
};

module.exports = {
  client: [
    new ModuleFederationPlugin({
      name: containerName,
      filename: containerFilename,
      remotes: remotes(false),
      exposes,
      shared: shared(false),
    }),
  ],

  server: [
    new NodeFederationPlugin({
      name: containerName,
      filename: containerFilename,
      library: serverLibrary,
      remotes: remotes(true),
      exposes,
      shared: shared(true),
    }),

    new StreamingTargetPlugin({
      name: containerName,
      library: serverLibrary,
      remotes: remotes(true),
    }),
  ],
};
