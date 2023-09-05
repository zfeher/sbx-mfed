const { ModuleFederationPlugin } = require('webpack').container;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require('@module-federation/node');
const { createDelegatedModule } = require('@module-federation/utilities');
const DelegateModulesPlugin =
  require('@module-federation/utilities/src/plugins/DelegateModulesPlugin').default;

const { serverLibrary, defaultShareScope } = require('./constants');

const containerName = 'remote1';
const containerFilename = 'remoteEntry.js';

const exposes = {
  './box': './src/components/Box.jsx',
  './title': './src/components/Title.jsx',
};

const remotes = (isServer) => {
  const location = isServer ? 'server' : 'client';
  return {
    //
    // remote2: `remote2@http://localhost:3004/${location}/remoteEntry.js`,
    //
    // delegate modules
    remote2: createDelegatedModule(require.resolve('../remote-delegate.js'), {
      remote: `remote2@http://localhost:3004/${location}`,
      // remote: `remote2@http://localhost:3004/${location}/remoteEntry.js`,
    }),
  };
};

const shared = (isServer) => {
  return {
    ...defaultShareScope(isServer),

    '@module-federation/utilities': {
      singleton: true,
      // strictVersion: true,
      import: false,
    },

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
    new DelegateModulesPlugin({
      container: containerName,
      // runtime: 'webpack',
      runtime: containerName,
      remotes: remotes(false),
      debug: false,
    }),

    new ModuleFederationPlugin({
      name: containerName,
      filename: containerFilename,
      remotes: remotes(false),
      exposes,
      shared: shared(false),
    }),
  ],

  server: [
    new DelegateModulesPlugin({
      container: containerName,
      // runtime: 'webpack',
      runtime: containerName,
      remotes: remotes(true),
      debug: false,
    }),

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
