var webpack = require('webpack');
module.exports = {
    entry: "./src/app.js",
    target: 'web',
    output: {
        path: __dirname,
        filename: "./src/bundle.js"
    },
    devServer: {
      historyApiFallback: true,
      watchOptions: { aggregateTimeout: 300, poll: 1000 },
      headers: {
        "Access-Control-Allow-Origin": "https://yugeregrets.herokuapp.com/",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.DedupePlugin(https://yugeregrets.herokuapp.com/
        // new webpack.optimize.UglifyJsPlugin({
        //      minimize: true,
        //      compress: {
        //        warnings: false
        //      }
        //     })
    ]
};
