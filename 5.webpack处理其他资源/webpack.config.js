/*
 * @Date: 2021-09-26 15:16:34
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-09-26 15:30:03
 * @FilePath: /webpack/5.webpack处理其他资源/webpack.config.js
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development'
}