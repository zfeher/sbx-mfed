const { ModuleFederationPlugin } = require('webpack').container;
const { SharePlugin } = require('webpack').sharing;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require('@module-federation/node');
const { createDelegatedModule } = require('@module-federation/utilities');
const { ChunkCorrelationPlugin } = require('@module-federation/node');
const DelegateModulesPlugin =
  require('@module-federation/utilities/src/plugins/DelegateModulesPlugin').default;

// const JsonpChunkLoadingRuntimeModule = require('webpack/lib/web/JsonpChunkLoadingRuntimeModule');
const {
  JsonpChunkLoadingRuntimeModule,
} = require('./JsonpChunkLoadingRuntimeModule/JsonpChunkLoadingRuntimeModule');
const {
  InvertedContainerPlugin,
} = require('./InvertedContainerPlugin/InvertedContainerPlugin');

const {
  serverLibrary,
  DEFAULT_SHARE_SCOPE_BROWSER,
  DEFAULT_SHARE_SCOPE,
} = require('./constants');

const containerName = 'remote4';
const containerFilename = 'remoteEntry.js';

const exposes = {
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
    //   // eager: isServer ? undefined : true,
    //   // strictVersion: true,
    //   // import: false,
    //   // import: isServer ? false : undefined,
    // },
  };
};

module.exports = {
  client: [
    // new SharePlugin({
    //   shared: shared(false),
    // }),

    // new JsonpChunkLoadingRuntimeModule({ debug: false }),

    // new DelegateModulesPlugin({
    //   container: containerName,
    //   runtime: 'webpack',
    //   remotes: remotes(false),
    //   debug: false,
    // }),

    // new ChunkCorrelationPlugin({
    //   // filename: 'static/chunks/federated-stats.json',
    //   filename: 'dist/client/federated-stats.json',
    // }),

    // new InvertedContainerPlugin({
    //   runtime: 'webpack',
    //   container: containerName,
    //   remotes: remotes(false),
    //   debug: false,
    // }),

    new ModuleFederationPlugin({
      name: containerName,
      filename: containerFilename,
      remotes: remotes(false),
      exposes,
      shared: shared(false),
    }),
  ],

  server: [
    // new SharePlugin({
    //   shared: shared(true),
    // }),

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
