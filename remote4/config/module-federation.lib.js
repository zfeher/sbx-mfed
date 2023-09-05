const { ModuleFederationPlugin } = require('webpack').container;
const { SharePlugin } = require('webpack').sharing;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require('@module-federation/node');

const {
  serverLibrary,
  DEFAULT_SHARE_SCOPE_BROWSER,
  DEFAULT_SHARE_SCOPE,
} = require('./constants');

const containerName = 'remote4';
const containerFilename = 'remoteEntry.js';

const exposes = {};

const shared = (isServer) => {
  return {
    ...defaultShareScope(isServer),

    lib5: {
      singleton: true,
      eager: true,
      // import: false,
    },

    // 'lib5/lib.server': {
    //   singleton: true,
    //   import: false,
    // },

    // 'lib5/lib.client': {
    //   singleton: true,
    //   import: false,
    // },

    // lodash: {
    //   singleton: true,
    //   // eager: isServer ? undefined : true,
    //   // strictVersion: true,
    //   // import: false,
    //   // import: isServer ? false : undefined,
    // },
  };
};

const remotes = (isServer) => {
  const webpackLocation = isServer ? 'server' : 'client';
  return {};
};

module.exports = {
  client: [
    new SharePlugin({
      shared: shared(false),
    }),

    // new ModuleFederationPlugin({
    //   name: containerName,
    //   filename: containerFilename,
    //   remotes: remotes(false),
    //   exposes,
    //   shared: shared(false),
    // }),
  ],

  server: [
    new SharePlugin({
      shared: shared(true),
    }),

    // new NodeFederationPlugin({
    //   name: containerName,
    //   filename: containerFilename,
    //   library: serverLibrary,
    //   remotes: remotes(true),
    //   exposes,
    //   shared: shared(true),
    // }),

    // new StreamingTargetPlugin({
    //   name: containerName,
    //   library: serverLibrary,
    //   remotes: remotes(true),
    // }),
  ],
};