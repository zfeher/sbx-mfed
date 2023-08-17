module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: { config: `${__dirname}/tailwind.config.js` },
    autoprefixer: {},
  },
};
