import { APP_DIR, DIST_DIR } from './utils/folders';

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
    port: 8080,

    hot: true,
    hotOnly: true,
  },
};
