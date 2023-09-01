const path = require('node:path');

module.exports = {
  //   resolve: {
  //     extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  //   },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        // todo: we can be smart here and include third party 1wizz packages and process
        //  them as well (until they are not mfe or shared deps ofc)
        exclude: /node_modules/,
        // exclude: (input) => {
        //   if (input.includes('athing')) console.log('@@@@@@@', input);
        //   return !input.includes('athing');
        // },

        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            },
          },

          {
            // todo: finalize
            loader: path.resolve('../remote2-next/tailwind-prefixer-loader.js'),

            options: {
              prefix: 'rmt2-',
              tailwindConfigPath: './remoteEntry/tailwind.config.js',
            },
          },
        ],
      },

      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },

      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
};
