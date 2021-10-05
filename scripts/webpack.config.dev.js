const path = require("path");
const webpack = require('webpack');
var pkg=require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');


/**
 * webpack url https://www.cnblogs.com/brandonhulala/p/6057378.html
 */


let port = 8081;
let publicPath = `http://localhost:${port}/`;
module.exports = {
    mode: 'development',
    entry: "./src/main.tsx",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "assert/js/shy.[hash:8].js",
        publicPath
    },
    devServer: {
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
        // proxy: {
        //     "/api": `http://localhost:8888`,
        //     "/socket": {
        //         target: `http://localhost:8888/primus`,
        //         ws: true,
        //     }
        // }
    },
    resolve: {
        extensions: ['.tsx', ".ts", ".js", ".less", ".css"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: ["ts-loader"]
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
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
                            publicPath: '../../'
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
            test: /\.(jpe?g|png|gif|bmp|webp)$/,
            // 规则 limit给定的是图片的大小 如果我们给定图片的大小大于等于我们给定的limit 则不会被转为base64编码
            //反之会被转换name=[hash:8]-[name].[ext] 前面加hash值区分图片 名字原样输出
            use: ['url-loader?limit=8192&name=assert/img/[hash:8].[name].[ext]']
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
            use: ['url-loader?limit=8192&name=assert/fonts/[hash:8].[name].[ext]']
        }]
    },
    externals: {

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../index.html"), // 婧愭ā鏉挎枃浠�
            filename: 'index.html', // 杈撳嚭鏂囦欢銆愭敞鎰忥細杩欓噷鐨勬牴璺緞鏄痬odule.exports.output.path銆�
            showErrors: true,
            hash: true
        }),
        new webpack.DefinePlugin({
            MODE: JSON.stringify('pro'),
            VERSION: JSON.stringify(pkg.version),
            API_MASTER_URL: JSON.stringify('http://127.0.0.1:8888')
        }),
        new MiniCssExtractPlugin({
            filename: "shy.css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }]
            },
            canPrint: true
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    { from: path.join(__dirname, "../../rich/extensions/emoji/emoji.json"), to: "data/emoji.json" },
                    { from: path.join(__dirname, "../../rich/extensions/font-awesome/font-awesome.json"), to: "data/font-awesome.json" }
                ]
            }
        )
    ]
};