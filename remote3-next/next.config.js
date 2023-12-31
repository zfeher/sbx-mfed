const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { createDelegatedModule } = require('@module-federation/utilities');

const remotes = (isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
  // webpack
  // const location = isServer ? 'server' : 'client';
  return {
    //
    // delegate modules
    //
    remote2: createDelegatedModule(require.resolve('./remote-delegate.js'), {
      remote: `remote2@http://localhost:3004/_next/static/${location}`,
      // remote: `remote2@http://localhost:3004/_next/static/${location}/remoteEntry.js`,
      // remote2: `remote2@http://localhost:3004/${location}/remoteEntry.js`,
    }),
    //
    // remote2: `remote2@http://localhost:3006/_next/static/${location}/remoteEntry.js`,
    // remote2: `remote2@http://localhost:3004/_next/static/${location}/remoteEntry.js`,
    //
    // webpack
    // remote2: `remote2@http://localhost:3004/${location}/remoteEntry.js`,
    //
    //
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
        name: 'remote3',
        filename: 'static/chunks/remoteEntry.js',

        exposes: {
          './title': './src/components/Title.jsx',
          './button': './src/components/Button.jsx',
        },

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

        remotes: remotes(options.isServer),

        extraOptions: {},
      }),
    );

    return config;
  },
};
