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


## 常用插件

```
html-webpack-plugin // 生成.html文件的插件
clean-webpack-plugin // 清理webpack打包生成的dist文件
    plugins: [
      new CleanWebpackPlugin()
    ]
min-css-extract-plugin // 把样式提取为单独的css文件 的插件

```

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

## [4.webpack打包图片资源](https://github.com/zhangwen0424/webpack/tree/master/4.webpack打包图片资源)

安装  
yarn add html-loader url-loader file-loader -D

webpack配置

```javascript
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    clean: true,// 清理打包文件
    // publicPath: './',
    // assetModuleFilename: 'imgs/[name].[hash:5][ext]',//webpack5的写法，指定打包后的文件路径和名字,所有资源都放到这里了
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        // 使用多个loader，用use
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      /* webpack4写法，存在图片加载不出来问题，改成webpack5写法
      {
        // 处理图片资源，url-loader处理不了html中的img图片
        // url-loader是基于file-loader的
        // 排除其他资源，url-loader比file-loader多了一个limit功能，能把小图片转换成base64文本格式加载，减轻服务器压力
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          // 小于8kb会被base64处理，可以减少服务器请求，但是图片体积会变大
          limit: 8*1024,
          // url-loader默认使用es6模块化解析，而图片使用的是import引入，解析出现[object Module]问题
          // 关闭url-loader中的es6模块化，使用commonjs进行解析
          // esModule: false,
          // 给图片进行重命名，取图片hash前5位，[ext]取文件原来的扩展名
          name: '[name].[hash:5].[ext]',
          outputPath: 'asset/imgs',// 为你的文件配置自定义 output 输出目录 ; 用来处理图片路径问题
          // publicPath: "assets/imgs",// 为你的文件配置自定义 public 发布目录 ; 用来处理图片路径问题
        },
      }, */
      // webpack5的写法，处理css中的图片资源
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        type: 'asset/resource',// 资源模块类型，生成同webpack4，发送一个单独的文件并导出URL，替代file-loader
        generator: {// 指定生成的文件路径和名称，这里配置generator，单独配置生成路径和地址。如果通过配置ouput中的assetModuleFilename，会将所有资源都放入
          filename: 'imgs/[name].[hash:6][ext]'
        }
        // type: 'asset/inline',// 资源模块类型，不生成文件，处理成base64了（此时不可使用generator），导出一个资源的data URL，替代url-loader
      },
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
```

## [5.webpack处理其他资源](https://github.com/zhangwen0424/webpack/tree/master/5.webpack处理其他资源)

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
}
```

## [6.devServer](https://github.com/zhangwen0424/webpack/tree/master/6.devServer)

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

## [7.开发环境配置](https://github.com/zhangwen0424/webpack/tree/master/7.开发环境配置)

```js
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
```

## 8.提取css为单独文件

webpack.config.js

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 5001,
    open: true,
  }
}
```

## 9.css兼容性处理

webpack.config.js

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          {
            /* 
              配置环境变量：
                  process.env.NODE_ENV = 'development';
                  mode: 'development'

              css兼容性处理：postcss --> postcss-loader postcss-preset-env
              帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
                  "browserslist": {
                    // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
                    "development": [
                      "last 1 chrome version",
                      "last 1 firefox version",
                      "last 1 safari version"
                    ],
                    // 生产环境：默认是看生产环境
                    "production": [
                      ">0.2%",
                      "not dead",
                      "not op_mini all"
                    ]
                  }
             */
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-preset-env'
                ]
              }
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/mian.css'
    })
  ],
  devServer: {
    static: resolve(__dirname, 'build'),
    port: 5001,
    compress: true,
    // open: true,
  }
}

