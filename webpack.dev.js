var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

var config = require('./webpack.base');

config.entry = {
    app: ["./src/entre.js", "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&overlay=false"],
};

config.output = {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/dist/',
}

config.module.rules.unshift({
    test: /\.css$/,
    use: [
        'style-loader',
        'less-loader',
        {
            loader: 'postcss-loader',
            options: {
                plugins: [require('autoprefixer')]
            }
        }
    ],
})

config.module.rules.unshift({
    test: /\.less$/,
    use: [
        'style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                plugins: [require('autoprefixer')]
            }
        },
        'less-loader',
    ],
})

config.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CaseSensitivePathsPlugin()
);

module.exports = config;