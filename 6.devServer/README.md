<!--
 * @Date: 2021-09-26 15:28:41
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-12-23 14:42:31
 * @FilePath: /webpack/6.devServer/README.md
-->

# [6.devServer](https://github.com/zhangwen0424/webpack/tree/master/6.devServer)

webpack.config.js配置

```javascript
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
  // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径，新版webpack-dev-server取消了这个属性，需要使用static
    // contentBase: resolve(__dirname, 'build'),
    static: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3002,
    // 自动打开浏览器
    open: true
  }
}
```
