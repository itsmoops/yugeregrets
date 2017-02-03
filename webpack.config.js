const webpack = require('webpack');
const autoprefixer = require('autoprefixer')
const path = require('path')

module.exports = {
    entry: "./src/app.js",
    target: 'web',
    output: {
      path: path.join(__dirname, '/src/dist/'),
      filename: '[name].bundle.js',
      publicPath: '/dist/'
    },
    devServer: {
      historyApiFallback: true,
      watchOptions: { aggregateTimeout: 300, poll: 1000 }
    },
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            'css-loader?importLoaders=1',
            'postcss-loader',
            'stylus-loader'
          ]
        }, {
          test: /\.(jpg|png|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 25000,
          }
        }, {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: [ 'babel-loader' ]
        }
      ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.LoaderOptionsPlugin({
          options: {
            postcss: [ autoprefixer ]
          }
        })
    ]
};
