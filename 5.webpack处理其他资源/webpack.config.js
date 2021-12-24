/*
 * @Date: 2021-09-26 15:16:34
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-12-23 14:17:19
 * @FilePath: /webpack/5.webpack处理其他资源/webpack.config.js
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 把样式提取为单独的css文件 的插件
const MiniCssExtractPlugin= require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    publicPath: './',// 用来处理路径问题，加在所有文件路径前的根路径
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 使用MiniCssExtractPlugin.loader单独生成文件不能在使用style-loader，两者冲突
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        // 排除其他资源，url-loader比file-loader多了一个limit功能，能把小图片转换成base64文本格式加载，减轻服务器压力
        exclude: /\.(js|css|html)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:5].[ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      ignoreOrder: false,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
}