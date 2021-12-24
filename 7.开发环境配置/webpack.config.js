const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // 模式
  mode: 'development',// 开发环境
  // mode: 'production',// 生产环境
  // 入口文件
  entry: './src/js/index.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'index.js',
    // 输出路径  __dirname：nodejs变量，代表当前目录的绝对路径
    path: resolve(__dirname, 'build'),
    // 用来处理路径问题，加在所有文件路径前的根路径
    publicPath: './',
    // assetModuleFilename: 'imgs/[name].[hash:5][ext]',//webpack5的写法，指定打包后的文件路径和名字,所有资源都放到这里了
    // 清理打包文件
    clean: true,
  },
  module: {
    // loader的配置
    rules: [
      // 处理css资源
      {
        test: /\.css$/,
        // 使用多个loader，用use
        // 使用MiniCssExtractPlugin.loader单独生成文件不能在使用style-loader，两者冲突
        use: ['style-loader', 'css-loader', 'less-loader']
        // use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // use: ExtractTextWebpackPlugin.extract({
        //   fallback: "style-loader",
        //   use: "css-loader"
        // })
      },
      // 处理less资源
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        // use: [MiniCssExtractPlugin.loader, 'css-loader','less-loader'],
      },
      // 处理图片资源
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        type: 'asset/resource',// 资源模块类型，生成同webpack4，发送一个单独的文件并导出URL，替代file-loader
        generator: {
          filename: 'imgs/[name].[hash:6][ext]'
        },
        // type: 'asset/inline',// 资源模块类型，不生成文件，处理成base64了（此时不可使用generator），导出一个资源的data URL，替代url-loader
      },
      // 处理html中img资源
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      // 处理其他资源
      {
        exclude:/\.(html|js|css|less|jpg|png|jpeg)/,
        loader: 'file-loader',
        options: {
          name:  '[name].[hash:6].[ext]',
          outputPath: 'media' 
        },
        type: 'asset/inline',// 资源模块类型，不生成文件
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // new ExtractTextWebpackPlugin('/css/index.css'),
    // new CleanWebpackPlugin(),
  ],
  // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径，新版webpack-dev-server取消了这个属性，需要使用static
    // contentBase: resolve(__dirname, 'build'),
    static: resolve(__dirname, 'build'),
    port: 5001,
    // 启动gzip压缩
    compress: true,
    // 自动打开浏览器
    open: true
  }
}