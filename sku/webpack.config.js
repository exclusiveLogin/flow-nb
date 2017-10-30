var webpack = require("webpack");
module.exports = {
    entry:{
        loader:"./js/loader.js",
        vendor:"./js/vendor.js"
    },
    output:{
        path: __dirname + "/public/",
        filename: "[name].js",
        publicPath:"public/"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?presets[]=env'
            },
            {
                test: require.resolve("jquery2"),
                loader: "expose-loader?$!expose-loader?jQuery"
            },
            {
                test:/\.css$/,
                loader:"style-loader!css-loader"
            },
            {
                test:/\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
                loader:"file-loader?name=[path][name].[ext]"
            }
        ]
    },
    devtool:'source-map',
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap:true
        })
    ]
}