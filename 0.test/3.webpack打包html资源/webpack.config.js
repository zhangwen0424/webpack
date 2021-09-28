/*
 * @Date: 2021-09-24 11:03:22
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-09-24 11:15:57
 * @FilePath: /webpack/0.test/3.webpack打包html资源/webpack.config.js
 */
const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    // 默认会创建一个空的html文件，自动引入打包所有资源（js/css）
    // 打包文件中js资源引入script属性中会加defer：<script defer src="index.js"></script>
    // - 当script中有defer属性时，脚本的加载过程和文档加载是异步发生的，等到文档解析完(DOMContentLoaded事件发生)脚本才开始执行。
    // - 当script有async属性时，脚本的加载过程和文档加载也是异步发生的。但脚本下载完成后会停止HTML解析，执行脚本，脚本解析完继续HTML解析。
    // - 当script同时有async和defer属性时，执行效果和async一致
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
  mode: 'development'
}