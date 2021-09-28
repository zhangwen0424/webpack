/*
 * @Date: 2021-09-24 16:33:33
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-09-26 15:37:30
 * @FilePath: /webpack/0.test/4.webpack打包图片资源/webpack.config.js
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    // publicPath: 'build/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        // 使用多个loader，用use
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      // {
      //   // 处理图片资源，url-loader处理不了html中的img图片
      //   // url-loader是基于file-loader的
      //   // 排除其他资源，url-loader比file-loader多了一个limit功能，能把小图片转换成base64文本格式加载，减轻服务器压力
      //   test: /\.(jpg|png|gif)/,
      //   loader: 'url-loader',
      //   options: {
      //     // 小于13kb会被base64处理，可以减少服务器请求，但是图片体积会变大
      //     limit: 13*1024,
      //     // url-loader默认使用es6模块化解析，而图片使用的是import引入，解析出现[object Module]问题
      //     // 关闭url-loader中的es6模块化，使用commonjs进行解析
      //     esModule: false,
      //     // 给图片进行重命名，取图片hash前5位，[ext]取文件原来的扩展名
      //     // name: '[name].[hash:5].[ext]',
      //   },
      // },
      // {
      //   // exclude: /\.(less|html)$/,
      //   test: /\.(jpg|png|gif)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[hash:5].[ext]',
      //     esModule: false,
      //   }
      // },
      {
        // 使用html-loader处理html文件中的img图片（负责引入img，从而被url-loader处理）
        test: /\.html$/,
        loader: 'html-loader',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
  mode: 'development'
}