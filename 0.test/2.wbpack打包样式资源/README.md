<!--
 * @Date: 2021-09-24 10:24:03
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-09-24 16:20:00
 * @FilePath: /webpack/0.test/2.wbpack打包样式资源/README.md
-->

# 2.wbpack打包样式资源

安装包
yarn add css-loader style-loader less-loader less -D  
webpack配置文件

```javascript
/**
 * webpack.config.js  webpack的配置文件
 *    指定webpack指令要干什么
 *    所有的构建工具基于nodejs平台运行
 *    模块化采用的是commonjs
 */

// resolve用来拼接绝对路径
const { resolve } = require('path');

module.exports = {
  // 入口文件
  entry: './src/index.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'index.js',
    // 输出路径
    // __dirname：nodejs变量，代表当前目录的绝对路径
    path: resolve(__dirname, 'build'),
  },
  // loader配置
  module: {
    // 不同文件必须配置不同loder处理
    rules: [{
      // 匹配哪些文件
      test: /\.css$/,
      // 使用哪些loader
      // use数组中loader执行顺序为：从右向左，从下向上，依次执行
      use: [
        // 创建style便签，将css文件资源插入到head中生效
        'style-loader',
        // 将css文件变成commonjs模块加载到js中，内容是样式字符串
        'css-loader',
      ],
    }, 
    {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        // 将less文件编译成css文件，需要下载包less-loader和less
        'less-loader'
      ]
    }
    ],
  },
  // 模式
  mode: 'development',// 开发环境
  // mode: 'production',// 生产环境
};

```
