const webpack = require('webpack');
const path = require('path');

const {
  paths,
  outputFiles,
  rules,
  plugins,
  resolve,
  stats,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
} = require('./webpack/config');

const devServer = require('./webpack/dev-server').devServer;

const HtmlWebpackPlugin = require('html-webpack-plugin');


// Default client app entry file
const entry = [
  path.join(paths.javascript, 'client.js'),
];

plugins.push(
  // Builds index.html from template
  new HtmlWebpackPlugin({
    template: path.join(paths.source, 'index.html'),
    path: paths.build,
    filename: 'index.html',
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    },
  })
);

if (IS_DEVELOPMENT) {
  // Development plugins
  plugins.push(
    // Enables HMR
    new webpack.HotModuleReplacementPlugin(),
    // Don't emmit build when there was an error while compiling
    // No assets are emitted that include errors
    new webpack.NoEmitOnErrorsPlugin()
  );

  // For IE babel-polyfill has to be loaded before react-hot-loader
  entry.unshift('babel-polyfill');
}

// Webpack config
module.exports = {
  devtool: IS_PRODUCTION ? false : 'cheap-eval-source-map',
  mode: IS_PRODUCTION ? 'production' : 'development',
  context: paths.javascript,
  watch: !IS_PRODUCTION,
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  entry,
  output: {
    path: paths.build,
    publicPath: '/',
    filename: outputFiles.client,
  },
  module: {
    rules,
  },
  plugins,
  resolve,
  stats,
  devServer,
};
