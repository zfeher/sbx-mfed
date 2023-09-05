const NextFederationPlugin = require('@module-federation/nextjs-mf');
const path = require('node:path');

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

    config.module.rules.push({
      test: /\.(tsx|jsx|ts|js)$/,
      // todo: we can be smart here and include third party 1wizz packages and process
      //  them as well (until they are not mfe or shared deps ofc)
      exclude: /node_modules[/\\]/,
      // exclude: (input) => {
      //   if (input.includes('athing')) console.log('@@@@@@@', input);
      //   return !input.includes('athing');
      // },
      use: {
        loader: path.resolve('./tailwind-prefixer-loader.js'),
        options: {
          prefix: 'rmt2-',
          tailwindConfigPath: './remoteEntry/tailwind.config.js',
        },
      },
    });

    config.plugins.push(
      new NextFederationPlugin({
        name: 'remote2',
        filename: 'static/chunks/remoteEntry.js',

        exposes: {
          './title': './src/components/Title.jsx',
          './box': './src/components/Box.jsx',
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
