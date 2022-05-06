const path = require("path");
const webpack = require('webpack');
var pkg = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

var mode = 'dev';
if (process.argv.some(s => s == '--pro')) mode = 'pro';
else if (process.argv.some(s => s == '--beta')) mode = 'beta';
var isDev = mode == 'dev'
/**
 * webpack url https://webpack.docschina.org/guides/output-management/#cleaning-up-the-dist-folder
 */

let port = 8081;
let publicPath = `http://localhost:${port}/`;
if (mode == 'pro') publicPath = `https://static.shy.red/`;
else if (mode == 'beta') publicPath = `https://beta.shy.red/`;

var API_URLS = ['http://127.0.0.1:8888'];
if (mode == 'beta') API_URLS = ['https://beta-b1.shy.red'];
else if (mode == 'pro') API_URLS = ['https://api-m1.shy.red', 'https://api-m2.shy.red'];
var API_VERSION = 'v1';
var versionPrefix = pkg.version + '/';
var AUTH_URL = '/auth';
if (mode == 'pro') AUTH_URL = 'https://auth.shy.red/auth.html';
else if (mode == 'beta') AUTH_URL = 'https://beta.shy.red/auth.html';

var AMAP_KEY;
var AMAP_PAIR;
if (mode == 'pro') {
    AMAP_KEY = '19f3c275e81172f6e8086c0682862e77';
    AMAP_PAIR = '406947f7001f0867895cce9fab9f45b7';
}
else {
    AMAP_KEY = '34c3436f1b8f2b98b0093b4b4e5c34fb';
    AMAP_PAIR = '9345e5ad4e2e8c21f8f85513cba9d309';
}


module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: {
        main: './src/main.tsx',
        auth: './net/auth/view.ts'
    },
    devtool: isDev ? 'inline-source-map' : undefined,
    output: {
        path: path.resolve(__dirname, "../dist" + (isDev ? "" : '/' + mode)),
        filename: versionPrefix + "assert/js/shy.[name].[contenthash:8].js",
        chunkFilename: versionPrefix + 'assert/js/shy.[name].[contenthash:8].js',
        publicPath,
        // clean:true
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
                                path.resolve(__dirname, "../src/assert/less.less")
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
                filename: versionPrefix + 'assert/img/[name]-[contenthash:8][ext]',
            }
        },
        {
            test: /\.(jpe?g|png|gif|bmp|webp)$/,
            type: 'asset/resource',
            generator: {
                filename: versionPrefix + 'assert/img/[name]-[contenthash:8][ext]',
            },
            // 是parser，不是parse
            parser: {
                dataUrlCondition: {
                    // 是maxSize，不再是limit
                    maxSize: 5 * 1024
                }
            }
        },
        {
            test: /\.(json)$/,
            type: 'asset/resource',
            generator: {
                filename: versionPrefix + 'data/[name]-[contenthash:8][ext]',
            }
        },
        {
            test: /\.(woff2?|eot|ttf)$/,
            type: 'asset/resource',
            generator: {
                filename: versionPrefix + 'assert/font/[name]-[contenthash:8][ext]'
            },
            // 是parser，不是parse
            parser: {
                dataUrlCondition: {
                    // 是maxSize，不再是limit
                    maxSize: 5 * 1024
                }
            }
        }, {

            test: /\.md$/,
            use: [
                {
                    loader: "html-loader",
                },
                {
                    loader: "markdown-loader",
                    options: {
                        /* your options here */
                    }
                },
            ],
        }]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        isDev ? new webpack.HotModuleReplacementPlugin() : new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"), // 婧愭ā鏉挎枃浠�
            filename: 'index.html',
            showErrors: true,
            hash: false,
            chunks: ['main', 'shared'],
            favicon: false,
            templateParameters: {
                src: publicPath + versionPrefix
            },
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "auth.html"), // 婧愭ā鏉挎枃浠�
            filename: 'auth.html',
            showErrors: true,
            hash: true,
            chunks: ['auth'],
            favicon: false,
            templateParameters: {
                src: publicPath + versionPrefix
            },
        }),
        new webpack.DefinePlugin({
            MODE: JSON.stringify(mode),
            VERSION: JSON.stringify(pkg.version),
            API_MASTER_URLS: JSON.stringify(API_URLS),
            API_VERSION: JSON.stringify(API_VERSION),
            AUTH_URL: JSON.stringify(AUTH_URL),
            VERSION_PREFIX: JSON.stringify(versionPrefix),
            AMAP_KEY: JSON.stringify(AMAP_KEY),
            AMAP_PAIR: JSON.stringify(AMAP_PAIR)
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
        }),
        new MiniCssExtractPlugin({
            filename: versionPrefix + "assert/css/shy.[contenthash:8].css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "../src/assert/img/shy.svg"),
                    to: versionPrefix + 'assert/img/shy.fav.svg'
                },
                {
                    from: path.join(__dirname, "shared.js"),
                    to: versionPrefix + 'assert/js/shared.js'
                }
            ]
        })
        /**
         * 离线貌似有问题
         */
        // new WorkboxPlugin.GenerateSW({
        //     // 这些选项帮助快速启用 ServiceWorkers
        //     // 不允许遗留任何“旧的” ServiceWorkers
        //     clientsClaim: true,
        //     skipWaiting: true,
        //     mode: 'production',
        //     maximumFileSizeToCacheInBytes: 250000
        // }),
    ],
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            // async：异步导入， initial：同步导入， all：异步/同步导入
            chunks: "all",
            // 最小尺寸: 单位是字节，如果拆分出来一个, 那么拆分出来的这个包的大小最小为minSize
            minSize: 250000,
            // 将大于maxSize的包, 拆分成不小于minSize的包
            maxSize: 250000,
            // minChunks表示引入的包, 至少被导入了几次 【才拆分】
            minChunks: 1,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: versionPrefix + "assert/js/shy.[id].[contenthash:8].js",
                    chunks: 'all',
                },
                default: {
                    // 如果一个文件被引入了2次，就单独打包出来一个js文件
                    minChunks: 2,
                    filename: versionPrefix + "assert/js/shy.common.[id].[contenthash:8].js",
                    priority: -20
                }
            },
        },
    },
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
                { from: '/auth', to: "/auth.html" },
                { from: /^[a-zA-Z\d\/]+$/, to: '/index.html' }
            ]
        }
    }
}