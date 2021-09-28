<!--
 * @Date: 2021-09-26 15:28:41
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-09-27 10:03:15
 * @FilePath: /webpack/5.webpack处理其他资源/README.md
-->

# [5.webpack处理其他资源](https://github.com/zhangwen0424/webpack/tree/master/5.webpack处理其他资源)

webpack.config.js配置

```javascript
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
        exclude: /\.(js|css|html|less)$/,
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
```
