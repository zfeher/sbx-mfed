const client = require('./config/webpack.client');
const server = require('./config/webpack.server');
// const client = require('./config/webpack.lib.client');
// const server = require('./config/webpack.lib.server');

module.exports = [client, server];
