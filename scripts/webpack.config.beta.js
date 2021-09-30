const path = require("path");
var pkg = require('../package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
/**
 * webpack url https://www.cnblogs.com/brandonhulala/p/6057378.html
 */
let publicPath = `https://beta.shy.red/`;
var outputDir = path.join(__dirname, "../dist/beta");
module.exports = {
    mode: 'production',
    entry: "./src/main.tsx",
    output: {
        path: outputDir,
        filename: "assert/js/shy.[hash:8].js",
        chunkFilename: 'assert/js/[name].[hash:8].js',
        publicPath
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".less", ".css"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // 杩欓噷鍙互鎸囧畾涓�涓� publicPath
                        // 榛樿浣跨敤 webpackOptions.output涓殑publicPath
                        //publicPath: '../../'
                    },
                },
                'css-loader',
            ],
        },
        {
            test: /\.less$/,
            use:
                [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 杩欓噷鍙互鎸囧畾涓�涓� publicPath
                            // 榛樿浣跨敤 webpackOptions.output涓殑publicPath
                            //publicPath: '../../'
                        }
                    },
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
            test: /\.(jpe?g|png|gif|svg|bmp|webp)$/,
            // 规则 limit给定的是图片的大小 如果我们给定图片的大小大于等于我们给定的limit 则不会被转为base64编码
            //反之会被转换name=[hash:8]-[name].[ext] 前面加hash值区分图片 名字原样输出
            loader: 'url-loader?limit=8192&name=assert/img/[hash:8].[name].[ext]'
        },
        {
            test: /assert\/font[\w\-\/]+\.(svg)$/,
            // 规则 limit给定的是图片的大小 如果我们给定图片的大小大于等于我们给定的limit 则不会被转为base64编码
            //反之会被转换name=[hash:8]-[name].[ext] 前面加hash值区分图片 名字原样输出
            loader: 'url-loader?limit=8192&name=assert/img/[hash:8].[name].[ext]'
        },
        {
            test: /assert\/svg\/[\w\.]+\.svg$/,
            use: ['@svgr/webpack'],
        },
        {
            test: /\.(woff2?|eot|ttf)$/,
            // 规则 limit给定的是图片的大小 如果我们给定图片的大小大于等于我们给定的limit 则不会被转为base64编码
            //反之会被转换name=[hash:8]-[name].[ext] 前面加hash值区分图片 名字原样输出
            loader: 'url-loader?limit=8192&name=assert/font/[hash:8].[name].[ext]'
        }]
    },
    externals: {

    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../index.html"), //
            filename: './index.html', // 
            showErrors: true,
            hash: true,
        }),
        new webpack.DefinePlugin({
            MODE: JSON.stringify('pro'),
            VERSION: JSON.stringify(pkg.version),
            API_MASTER_URL: JSON.stringify('https://b1.beta.shy.red')
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }]
            },
            canPrint: true
        }),
        new MiniCssExtractPlugin({
            filename: "assert/css/shy.[hash:8].css"
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    { from: path.join(__dirname, "../../rich/extensions/emoji/emoji.json"), to: "data/emoji.json" },
                    { from: path.join(__dirname, "../../rich/extensions/font-awesome/font-awesome.json"), to: "data/font-awesome.json" }
                ]
            }
        ),
    ]
};