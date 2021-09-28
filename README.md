# webpack记录

[toc]

## 初始化项目
包默认放在webpack根目录里面，不用每个项目都去安装 

**1.进入项目目录**
cd webpack

**2.初始化package.json**
yarn init

**3.安装webpack webpack-cli**
yarn add webpack webpack-cli -D


**4.进入指定项目开发**
cd 1.webpack处理js和json

## [1.webpack处理js和json](https://github.com/zhangwen0424/webpack/tree/master/1.webpack处理js和json)

  index.js: webpack入口起点文件

  1.运行指令：
    开发环境：webpack ./src/index.js -o ./build/built.js --mode=development
      webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js
      整体打包环境，是开发环境
    生产环境：webpack ./src/index.js -o ./build/built.js --mode=production
      webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js
      整体打包环境，是生产环境

  2.结论：
    1. webpack能处理js/json资源，不能处理css/img等其他资源
    2. 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化~
    3. 生产环境比开发环境多一个压缩js代码。

## [2.wbpack打包样式资源](https://github.com/zhangwen0424/webpack/tree/master/2.wbpack打包样式资源)

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

## [3.webpack打包html资源](https://github.com/zhangwen0424/webpack/tree/master/3.webpack打包html资源)

安装包  
yarn add html-webpack-plugin -D

webpack配置  

```javascript

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

```

## [5.webpack处理其他资源](https://github.com/zhangwen0424/webpack/tree/master/5.webpack处理其他资源)

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
```
