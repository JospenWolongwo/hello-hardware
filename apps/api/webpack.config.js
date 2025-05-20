const { composePlugins, withNx } = require('@nx/webpack');
const nodeExternals = require('webpack-node-externals');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`

  // Exclude node_modules from the bundle
  config.externals = [nodeExternals()];

  // Add source map support
  config.devtool = 'source-map';

  // Set the target to node since this is a backend application
  config.target = 'node';

  // Add proper handling of native addons
  config.node = {
    __dirname: false,
    __filename: false,
  };

  return config;
});
