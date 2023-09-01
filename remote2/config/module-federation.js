const { ModuleFederationPlugin } = require('webpack').container;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require('@module-federation/node');

const { serverLibrary } = require('./constants');

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
    // todo: other next shared stuff too or via consts
    // ...(isServer ? DEFAULT_SHARE_SCOPE : DEFAULT_SHARE_SCOPE_BROWSER),

    react: {
      singleton: true,
      requiredVersion: false,
      // eager: isServer ? false : true,
      // import: isServer ? false : undefined,
      import: false,
    },

    'react-dom': {
      singleton: true,
      requiredVersion: false,
      // eager: isServer ? false : true,
      // import: isServer ? false : undefined,
      import: false,
    },

    'react/jsx-dev-runtime': {
      singleton: true,
      requiredVersion: false,
      // eager: false,
      // import: undefined,
      import: false,
    },

    'react/jsx-runtime': {
      singleton: true,
      requiredVersion: false,
      // eager: false,
      // import: isServer ? false : undefined,
      import: false,
    },

    // lodash: {
    //   singleton: true,
    //   // eager: isServer ? undefined : true,
    //   // strictVersion: true,
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
