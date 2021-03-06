const HtmlWebpackPlugin = require('html-webpack-plugin');
const { APP_DIR, DIST_DIR } = require('./utils/folders');

module.exports = {
  entry: {
    main: `${APP_DIR}/index.js`,
  },

  output: {
    filename: '[name].js',
    path: DIST_DIR,
  },

  resolve: {
    modules: ['node_modules'],
  },

  node: {
    fs: 'empty',
  },

  // https://github.com/webpack-contrib/karma-webpack
  devtool: 'inline-source-map',

  devServer: {
    contentBase: DIST_DIR,
    compress: true,
    port: 7075,

    hot: true,
    hotOnly: true,
  },

  plugins: [
    // https://webpack.js.org/plugins/html-webpack-plugin/
    new HtmlWebpackPlugin({
      title: 'PWA IndexedDB playground',
      template: `${APP_DIR}/index.html`,
    }),
  ],
};
