/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/Button.jsx', './src/components/Title.jsx'],
  important: '.mfe-remote3',

  theme: {
    extend: {},
  },

  corePlugins: {
    preflight: false,
  },

  plugins: [],
};
