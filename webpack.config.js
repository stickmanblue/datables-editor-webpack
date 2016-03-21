'use strict';

var path = require('path');
var webpack = require('webpack');

let configDir = __dirname;
let baseDir = './src';

let basePath = path.resolve(configDir, baseDir);
let jsPath = path.resolve(basePath, './js');

let outputPath = path.resolve(configDir, './dist')

module.exports = {
    context: basePath,
    entry: path.resolve(jsPath, 'index.js'),
    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: '/assets/'
    },
    devtool: 'source-map', // or 'inline-source-map'
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    module: {
        loaders: [
          { test: /\.js$/, include: jsPath, loaders: ['babel', 'eslint'] },
          { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
          { test: /\.css$/, loader: 'style-loader!css'},
          { test: /\.scss$/, loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap']},
          { test: /\.(gif|png|jpg|svg|woff|woff2)?(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=8192'},
          { test: /\.(eot|ttf)$/, loader: 'file-loader'}
        ]
    },
    resolve: {
        alias: {
            'datatables.net': 'datatables',
            'datatables.net-editor': path.resolve(configDir, './lib/Editor-1.5.5/js/datatables.editor'),
            'datatables.net-editor-bs': path.resolve(configDir, './lib/Editor-1.5.5/js/editor.bootstrap')
        }
    },
};
