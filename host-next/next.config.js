const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { createDelegatedModule } = require('@module-federation/utilities');

const remotes = (isServer) => {
  // note: good to stick to next federation naming, client side might use Next/webpack too
  const nextLocation = isServer ? 'ssr' : 'chunks';
  // const webpackLocation = isServer ? 'server' : 'client';
  return {
    // remote1: `remote1@http://localhost:3002/_next/static/${nextLocation}/remoteEntry.js`,
    // remote1: `remote1@http://localhost:3002/static/${nextLocation}/remoteEntry.js`,
    //
    // delegate modules
    //
    remote1: createDelegatedModule(require.resolve('./remote-delegate.js'), {
      remote: `remote1@http://localhost:3002/_next/static/${nextLocation}`,
      // remote: `remote1@http://localhost:3002/_next/static/${nextLocation}/remoteEntry.js`,
      // remote: `remote1@http://localhost:3002/static/${nextLocation}/remoteEntry.js`,
    }),

    remote2: createDelegatedModule(require.resolve('./remote-delegate.js'), {
      remote: `remote2@http://localhost:3004/_next/static/${nextLocation}`,
      // remote: `remote2@http://localhost:3004/_next/static/${nextLocation}/remoteEntry.js`,
      // remote: `remote2@http://localhost:3004/static/${nextLocation}/remoteEntry.js`,
    }),

    remote3: createDelegatedModule(require.resolve('./remote-delegate.js'), {
      remote: `remote3@http://localhost:3006/_next/static/${nextLocation}`,
      // remote: `remote3@http://localhost:3006/_next/static/${nextLocation}/remoteEntry.js`,
      // remote: `remote3@http://localhost:3006/static/${nextLocation}/remoteEntry.js`,
    }),
  };
};

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack(config, options) {
    // // todo
    // config.optimization.minimize = false;

    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: remotes(options.isServer),

        shared: {
          '@module-federation/utilities': {
            singleton: true,
            // strictVersion: true,
          },

          // lodash: {
          //   // eager: true,
          //   // import: false,
          //   singleton: true,
          //   // strictVersion: true,
          // },
        },

        extraOptions: {},
      }),
    );

    return config;
  },
};
