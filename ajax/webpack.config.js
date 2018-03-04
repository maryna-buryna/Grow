var WebpackNotifierPlugin = require('webpack-notifier');
var webpack = require('webpack');

module.exports = {
    entry: "./public/app.js",
    output: {
        path: __dirname + "/public/assets/",
        publicPath: "/public/assets/",
        filename: "bundle.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [{
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(jpg|ttf|eot|jpg|png|jfif|ysvg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel?presets[]=es2015'
            }
        ]
    },
    watch: true,
    plugins: [
        new WebpackNotifierPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};