/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/Button.jsx', './src/components/Title.jsx'],
  important: '.mfe-remote1',

  theme: {
    extend: {},
  },

  corePlugins: {
    preflight: false,
  },

  plugins: [],
};
