const path = require("path");
const webpack = require('webpack');
var pkg = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


const CopyWebpackPlugin = require('copy-webpack-plugin');

var mode = 'dev';
var argv = (process.env.NODE_ENV || '').split(/[\s,]+/);
if (process.argv.some(s => s == '--pro')) mode = 'pro';
else if (process.argv.some(s => s == '--beta')) mode = 'beta';
if (argv.some(s => s == '--pro')) mode = 'pro';
else if (argv.some(s => s == '--beta')) mode = 'beta';

var platform = 'web';
if (process.argv.some(s => s == '--desktop')) platform = 'desktop';
else if (process.argv.some(s => s == '--server-side')) platform = 'server-side';
else if (process.argv.some(s => s == '--mobile')) platform = 'mobile';

if (argv.some(s => s == '--desktop')) platform = 'desktop';
else if (argv.some(s => s == '--server-side')) platform = 'server-side';
else if (argv.some(s => s == '--mobile')) platform = 'mobile';
var isUs = argv.some(s => s == '--us');
var isDev = mode == 'dev'
/**
 * webpack url https://webpack.docschina.org/guides/output-management/#cleaning-up-the-dist-folder
 */

let port = 8081;
var ip = '127.0.0.1';
// ip = '10.102.60.29'
//ip='169.254.246.31'
var httpUrl = 'http://' + ip + ':';
let publicPath = httpUrl + `${port}/`;
if (mode == 'pro') {
    publicPath = `https://static.shy.live/`.replace('shy.live', isUs ? "shy.red" : "shy.live");
    if (!isUs) {
        // publicPath = publicPath.replace('static.shy', 'cdn.shy')
    }
}
else if (mode == 'beta') publicPath = `https://beta.shy.live/`;
if (['desktop', 'server-side'].includes(platform) && ['pro', 'beta'].includes(mode)) publicPath = `shy://shy.live/`;

var API_MASTER_URLS = [httpUrl + '8888'];
if (mode == 'beta') API_MASTER_URLS = ['https://beta-b1.shy.live'];
else if (mode == 'pro') API_MASTER_URLS = ['https://api-m1.shy.live', 'https://api-m2.shy.live'].map(s => s.replace('shy.live', isUs ? "shy.red" : "shy.live"));

var FILE_URLS = [httpUrl + '8889']
if (mode == 'beta') FILE_URLS = ['https://beta-b2.shy.live'];
else if (mode == 'pro') FILE_URLS = [
    // 'https://api-s1.shy.live', 
    // 'https://api-s2.shy.live'
    'https://api-m1.shy.live',
    'https://api-m2.shy.live'
].map(s => s.replace('shy.live', isUs ? "shy.red" : "shy.live"));

var API_URLS = [httpUrl + '9000'];
if (mode == 'beta') API_URLS = ['https://beta-b2.shy.live'];
else if (mode == 'pro') API_URLS = isUs ? FILE_URLS : ['https://api-s3.shy.live', 'https://api-s4.shy.live'].map(s => s.replace('shy.live', isUs ? "shy.red" : "shy.live"));

var API_VERSION = 'v1';
var versionPrefix = pkg.version + '/';
var staticPrefix = 'static/';
var AUTH_URL = '/auth';
if (mode == 'pro') AUTH_URL = 'https://auth.shy.live/auth.html'.replace('shy.live', isUs ? "shy.red" : "shy.live");
else if (mode == 'beta') AUTH_URL = 'https://beta-auth.shy.live/auth.html';

if (['desktop', 'server-side'].includes(platform) && ['pro', 'beta'].includes(mode)) AUTH_URL = `shy://shy.live/auth.html`;

//console.log(platform, mode, isDev);

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

var dist = path.resolve(__dirname, "../dist" + (isDev ? "" : '/' + mode));
if (mode == 'pro') {
    if (platform == 'desktop') dist = path.resolve(__dirname, "../../desktop/dist/view");
    else if (platform == 'server-side') dist = path.resolve(__dirname, "../../desktop/dist/view-server");
    else if (platform == 'mobile') dist = path.resolve(__dirname, "../dist" + (isDev ? "mobile" : '/mobile-' + mode));
}
var TrackCode = '';
if (mode == 'pro') {
    if (isUs) {
        TrackCode = `
    <link rel="dns-prefetch" href="//shy.red">
    <link rel="dns-prefetch" href="//resources.shy.red">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-45568602-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'UA-45568602-1');
    </script>`
    }
    else {
        TrackCode = `
    <link rel="dns-prefetch" href="//shy.live">
    <link rel="dns-prefetch" href="//resources.shy.live">
    <script charset="UTF-8" id="LA_COLLECT" src="https://sdk.51.la/js-sdk-pro.min.js"></script>
    <script  src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
    <script>location.host.endsWith('shy.live')&& LA.init({ id: "3EweegziSpUbz8TW", ck: "3EweegziSpUbz8TW", autoTrack: true, hashMode: true })</script>`
    }
}


var viewEntrys = {
    auth: './auth/view.ts',
}
var htmls = [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, "index.html"), // 婧愭ā鏉挎枃浠�
        filename: 'shy.html',
        showErrors: true,
        hash: true,
        chunks: ['web'],
        favicon: false,
        templateParameters: {
            src: publicPath + versionPrefix,
            static: publicPath,
            TrackCode,
        }
    })
]
if (isUs) {
    htmls.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, "index.html"), // 婧愭ā鏉挎枃浠�
        filename: 'shy.red.html',
        showErrors: true,
        hash: true,
        chunks: ['web'],
        favicon: false,
        templateParameters: {
            src: publicPath + 'pro',
            static: publicPath,
            TrackCode: ''
        }
    }))
}
else {
    htmls.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, "index.html"), // 婧愭ā鏉挎枃浠�
        filename: 'shy.live.html',
        showErrors: true,
        hash: true,
        chunks: ['web'],
        favicon: false,
        templateParameters: {
            src: publicPath + 'pro',
            static: publicPath,
            TrackCode: ''
        }
    }))
}
var cps = [{
    from: path.join(__dirname, "../src/assert/img/shy.svg"),
    to: staticPrefix + 'img/shy.svg'
},
{
    from: path.join(__dirname, "shared.js"),
    to: versionPrefix + 'assert/js/shared.js'
},
{
    from: path.join(__dirname, "../../rich/extensions/data-grid/formula/docs"),
    to: staticPrefix + 'data-grid/formula/docs'
},
{
    from: path.join(__dirname, "../../rich/src/assert/static"),
    to: staticPrefix + 'rich-assets'
},
{
    from: path.join(__dirname, "../../rich/extensions/board/shapes/data"),
    to: staticPrefix + 'board/shapes/data'
},
{
    from: path.join(__dirname, "../../rich/blocks/data-grid/template/card/views/data"),
    to: staticPrefix + 'data-grid/template/datas'
},
{
    from: path.join(__dirname, "../src/assert/resource"),
    to: staticPrefix + 'img'
}];

if (platform == 'server-side') {
    Object.assign(viewEntrys, {
        server: { import: './server-side/index.tsx' },
    })
    htmls = [new HtmlWebpackPlugin({
        template: path.join(__dirname, "index.html"), // 婧愭ā鏉挎枃浠�
        filename: 'index.html',
        showErrors: true,
        hash: true,
        chunks: ['server'],
        favicon: false,
        templateParameters: {
            src: publicPath + versionPrefix,
            static: publicPath,
            TrackCode
        }
    })]
    cps = [{
        from: path.join(__dirname, "../src/assert/img/shy.blue.svg"),
        to: versionPrefix + 'assert/img/shy.svg'
    }]
}
else {
    Object.assign(viewEntrys, {
        web: { import: './src/surface/index.tsx' },
    })
    if (platform == 'web') {
        Object.assign(viewEntrys, {
            org: { import: './org/index.tsx' },
        })
        htmls.push(new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"), // 婧愭ā鏉挎枃浠�
            filename: 'org.html',
            showErrors: true,
            hash: true,
            chunks: ['org'],
            favicon: false,
            templateParameters: {
                src: publicPath + versionPrefix,
                static: publicPath,
                TrackCode
            }
        }))
    }
}


module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: viewEntrys,
    devtool: isDev ? 'inline-source-map' : undefined,
    output: {
        path: dist,
        filename: versionPrefix + "assert/js/shy.[name].[contenthash:8].js",
        publicPath
    },
    resolve: {
        extensions: ['.tsx', ".ts", ".js", ".less", ".css"],
        alias: {
            crypto: false,
            'react': path.resolve(__dirname, '../node_modules/react'),
            'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
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
            test: /\.(jpe?g|png|gif|bmp|webp|ico)$/,
            type: 'asset/resource',
            generator: {
                filename: staticPrefix + 'img/[name]-[contenthash:8][ext]',
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
            test: /\.(json|md)$/,
            type: 'asset/resource',
            generator: {
                filename: staticPrefix + 'data/[name]-[contenthash:8][ext]',
            }
        },
        {
            test: /\.(woff2?|eot|ttf)$/,
            type: 'asset/resource',
            generator: {
                filename: staticPrefix + 'font/[name]-[contenthash:8][ext]'
            },
            // 是parser，不是parse
            parser: {
                dataUrlCondition: {
                    // 是maxSize，不再是limit
                    maxSize: 5 * 1024
                }
            }
        }
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        isDev ? new webpack.HotModuleReplacementPlugin() : new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "auth.html"), // 婧愭ā鏉挎枃浠�
            filename: 'auth.html',
            showErrors: true,
            hash: true,
            chunks: ['auth'],
            favicon: false,
            templateParameters: {
                src: publicPath + versionPrefix,
                static: publicPath
            }
        }),
        ...htmls,
        new webpack.DefinePlugin({
            PLATFORM: JSON.stringify(platform),
            MODE: JSON.stringify(mode),
            VERSION: JSON.stringify(pkg.version),
            VERSION_CLIENT: JSON.stringify(pkg.client_version),
            VERSION_SERVER_CLIENT: JSON.stringify(pkg.server_version),
            API_MASTER_URLS: JSON.stringify(API_MASTER_URLS),
            API_URLS: JSON.stringify(API_URLS),
            FILE_URLS: JSON.stringify(FILE_URLS),
            API_VERSION: JSON.stringify(API_VERSION),
            AUTH_URL: JSON.stringify(AUTH_URL),
            VERSION_PREFIX: JSON.stringify(versionPrefix),
            ASSERT_URL: JSON.stringify(publicPath + versionPrefix),
            STATIC_URL: JSON.stringify(publicPath),
            AMAP_KEY: JSON.stringify(AMAP_KEY),
            AMAP_PAIR: JSON.stringify(AMAP_PAIR),
            REGIN: JSON.stringify(isUs ? "US" : "CN")
        }),
        // new OptimizeCssAssetsPlugin({
        //     assetNameRegExp: /\.css$/g,
        // }),
        new MiniCssExtractPlugin({
            filename: versionPrefix + "assert/css/shy.[contenthash:8].css"
        }),
        new CopyWebpackPlugin({
            patterns: cps
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
            maxSize: 250000 * 3,
            // minChunks表示引入的包, 至少被导入了几次 【才拆分】
            minChunks: 1,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: staticPrefix + "js/shy.nm.[id].[contenthash:8].js",
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
        static: {
            directory: path.join(__dirname, '../dist'),
        },
        client: {
            progress: true,
        },
        host: ip,
        compress: true,
        port: port,
        open: true,
        historyApiFallback: {
            rewrites: [
                { from: '/auth', to: "/auth.html" },
                { from: '/org', to: "/org.html" },
                { from: '/download', to: "/org.html" },
                { from: '/pricing', to: "/org.html" },
                { from: '/service_protocol', to: '/org.html' },
                { from: '/privacy_protocol', to: '/org.html' },
                { from: /^\/product\/[a-zA-Z\d\/]+$/, to: "/org.html" },
                { from: /^[a-zA-Z\d\/]+$/, to: '/shy.html' }
            ]
        }
    }
}