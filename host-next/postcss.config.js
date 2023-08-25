module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefixer': {
      prefix: 'fep-',
      ignore: [],
    },
  },
};
