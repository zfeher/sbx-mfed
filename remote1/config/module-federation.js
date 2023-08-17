const { ModuleFederationPlugin } = require('webpack').container;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require('@module-federation/node');
const { createDelegatedModule } = require('@module-federation/utilities');
// const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');

const {
  serverLibrary,
  DEFAULT_SHARE_SCOPE_BROWSER,
  DEFAULT_SHARE_SCOPE,
} = require('./constants');

const containerName = 'remote1';
const containerFilename = 'remoteEntry.js';

const exposes = {
  './print': './src/print.js',
  './alma': './src/getAlma.js',
  './title': './src/components/Title.jsx',
};

const shared = (isServer) => {
  return {
    // ...(isServer ? DEFAULT_SHARE_SCOPE : DEFAULT_SHARE_SCOPE_BROWSER),

    react: {
      singleton: true,
      // requiredVersion: false,
      // eager: false,
      import: false,
      //   import: isServer ? undefined : false,
    },

    'react-dom': {
      singleton: true,
      // requiredVersion: false,
      // eager: false,
      import: false,
      //   import: isServer ? undefined : false,
    },

    'react/jsx-dev-runtime': {
      singleton: true,
      // requiredVersion: false,
      // eager: false,
      import: undefined,
    },

    'react/jsx-runtime': {
      singleton: true,
      // requiredVersion: false,
      // eager: false,
      import: false,
      //   import: isServer ? undefined : false,
    },

    lodash: {
      // eager: true,
      // import: false,
      singleton: true,
      // strictVersion: true,
    },
  };
};

const remotes = (isServer) => {
  const location = isServer ? 'server' : 'client';
  return {
    //
    remote2: `remote2@http://localhost:3004/${location}/remoteEntry.js`,
    //
    // external-remotes
    // remote2: `remote2@[globalThis.remoteUrls.remote2.${location}]`,
    // remote2: isServer
    //   ? 'remote2@http://localhost:3004/server/remoteEntry.js'
    //   : 'remote2@[globalThis.remoteUrls.remote2.client]',
    // remote2: createDelegatedModule(require.resolve('../remote-delegate.js'), {
    //   // note: here we can pass anything just the name and let delegate resolve it etc
    //   remote: `remote2@http://localhost:3004/${location}/remoteEntry.js`,
    //   // remote: `remote2@3004`,
    // }),
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

    // new ExternalTemplateRemotesPlugin(),
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

    // new ExternalTemplateRemotesPlugin(),
  ],
};
