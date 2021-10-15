const path = require("path");
const webpack = require('webpack');
var pkg = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
var mode = 'dev';
if (process.argv.some(s => s == '--pro')) mode = 'pro';
else if (process.argv.some(s => s == '--beta')) mode = 'beta';
var isDev = mode == 'dev'
/**
 * webpack url https://www.cnblogs.com/brandonhulala/p/6057378.html
 */

let port = 8081;
let publicPath = `http://localhost:${port}/`;
if (mode == 'pro') publicPath = `https://shy.red/`;
else if (mode == 'beta') publicPath = `https://beta.shy.red/`;

var API_URL = 'http://127.0.0.1:8888';
if (mode == 'beta') API_URL = 'https://beta-b1.shy.red';
else if (mode == 'pro') API_URL = 'https://api-m1.shy.red';

var versionPrefix = pkg.version + '/';
module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: "./src/main.tsx",
    output: {
        path: path.resolve(__dirname, "../dist" + (isDev ? "" : '/' + mode)),
        filename: versionPrefix + "assert/js/shy.[contenthash].js",
        chunkFilename: versionPrefix + 'assert/js/[name].[contenthash].js',
        publicPath
    },
    resolve: {
        extensions: ['.tsx', ".ts", ".js", ".less", ".css"],
        alias: {
            crypto: false
        }
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: ["ts-loader"]
        },
        {
            test: /\.css$/,
            use: [
                isDev ? 'style-loader' : { loader: MiniCssExtractPlugin.loader },
                'css-loader',
            ],
        },
        {
            test: /\.less$/,
            use:
                [
                    isDev ? 'style-loader' : { loader: MiniCssExtractPlugin.loader },
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                path.resolve(__dirname, "../src/assert/theme.less")
                            ]
                        }
                    }
                ],
        },
        {
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: [
                { loader: '@svgr/webpack' },
            ]
        },
        {
            test: /\.svg$/,
            issuer: /\.(css|less|styl)$/,
            type: 'asset/resource',
            generator: {
                filename: versionPrefix + 'assert/img/[name]-[contenthash][ext]',
            }
        },
        {
            test: /\.(jpe?g|png|gif|bmp|webp)$/,
            type: 'asset/resource',
            generator: {
                filename: versionPrefix + 'assert/img/[name]-[contenthash][ext]',
            }
        },
        {
            test: /\.(json)$/,
            type: 'asset/resource',
            generator: {
                filename: versionPrefix + 'data/[name]-[contenthash][ext]',
            }
        },
        {
            test: /\.(woff2?|eot|ttf)$/,
            type: 'asset/resource',
            generator: {
                filename: versionPrefix + 'assert/font/[name]-[contenthash][ext]'
            }
        }
        ]
    },
    plugins: [
        isDev ? new webpack.HotModuleReplacementPlugin() : new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../index.html"), // 婧愭ā鏉挎枃浠�
            filename: 'index.html',
            showErrors: true,
            hash: true
        }),
        new webpack.DefinePlugin({
            MODE: JSON.stringify(mode),
            VERSION: JSON.stringify(pkg.version),
            API_MASTER_URL: JSON.stringify(API_URL)
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
        }),
        new MiniCssExtractPlugin({
            filename: versionPrefix + "assert/css/shy.[contenthash].css"
        })
    ]
};
if (isDev) {
    module.exports.devServer = {
        contentBase: path.resolve(__dirname, '../dist'),
        host: 'localhost',
        compress: true,
        hot: true,
        port: port,
        open: true,
        historyApiFallback: {
            rewrites: [
                { from: /^[a-zA-Z\d\/]+$/, to: '/index.html' }
            ]
        }
    }
}