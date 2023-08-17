module.exports = {
  //   resolve: {
  //     extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  //   },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },

      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },

      //   {
      //     test: /\.(ts|tsx|js|jsx)$/,
      //     exclude: /node_modules/,
      //     use: {
      //       loader: 'babel-loader',
      //     },
      //   },
    ],
  },
};
