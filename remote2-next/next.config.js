const NextFederationPlugin = require('@module-federation/nextjs-mf');

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
        name: 'remote2',
        filename: 'static/chunks/remoteEntry.js',

        exposes: {
          './print': './src/print.js',
          './alma': './src/getAlma.js',
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

        extraOptions: {},
      }),
    );

    return config;
  },
};
