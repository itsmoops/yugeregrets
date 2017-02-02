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
      watchOptions: { aggregateTimeout: 300, poll: 1000 }
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
        new webpack.optimize.DedupePlugin()
        // new webpack.optimize.UglifyJsPlugin({
        //      minimize: true,
        //      compress: {
        //        warnings: false
        //      }
        //     })
    ]
};
