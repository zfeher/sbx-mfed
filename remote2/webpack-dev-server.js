const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const argv = require('minimist')(process.argv.slice(2), {
  default: { p: 3000 },
  alias: { p: 'port' },
});

// todo: switching protocol like to https will affect this too ofc
const HOST = 'http://localhost';
const PORT = argv.port;

const webpackConfigs = require('./webpack.config.js').map((webpackConfig) => ({
  ...webpackConfig,
  mode: 'development',
  output: {
    ...webpackConfig.output,
    publicPath: `${HOST}:${PORT}/${webpackConfig.name}/`,
  },
}));

const devServerOptions = {
  port: PORT,
  client: { overlay: false },

  // might be needed later
  // https:true,

  // note: we need this so HMR can work when started with host app
  headers: { 'Access-Control-Allow-Origin': '*' },

  // note: this magically updates browser without reload when started with host app
  hot: true,

  liveReload: false,

  // todo: if we need this might wanna add source files, postcss, tailwind stuff
  // watchFiles: [],
};

const compiler = Webpack(webpackConfigs);

const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer();
