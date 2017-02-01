var webpack = require('webpack');
module.exports = {
    entry: "./js/app.js",
    target: 'web',
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devServer: {
      historyApiFallback: true,
      watchOptions: { aggregateTimeout: 300, poll: 1000 },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
