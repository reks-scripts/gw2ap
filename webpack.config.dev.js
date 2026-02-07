const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config')

module.exports = merge(webpackConfig, {

  mode: 'development',

  devtool: 'eval',

  output: {
    pathinfo: true,
    publicPath: '/',      // critical: absolute asset paths
    filename: '[name].js'
  },

  devServer: {
    host: '0.0.0.0',
    port: 8081,

    hot: true,

    // webpack 5: explicitly tell it what (not) to serve from disk
    static: false,

    devMiddleware: {
      publicPath: '/',    // matches output.publicPath
    },

    historyApiFallback: true,

    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }

})
