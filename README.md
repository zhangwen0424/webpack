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

## [8.提取css为单独文件](https://github.com/zhangwen0424/webpack/tree/master/8.提取css为单独文件)

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

## [9.css兼容性处理](https://github.com/zhangwen0424/webpack/tree/master/9.css兼容性处理)

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
```

## [10.css压缩](https://github.com/zhangwen0424/webpack/tree/master/10.css压缩)

webpack.config.js

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
  // mode: 'production',
  mode: 'development',
  entry: "./src/js/index.js",
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
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env']
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 抽离css
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 5000,
    open: true,
  }
}
```

## [11.js语法检查](https://github.com/zhangwen0424/webpack/tree/master/11.js语法检查)

webpack.config.js

```js
const {resolve} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      /*
        语法检查： eslint-loader  eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则：
            package.json中eslintConfig中设置~
              "eslintConfig": {
                "extends": "airbnb-base"
              }
            airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
      */
      // webpack4的用法
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/,
      //   options: {
      //     // 自动修复eslint的错误
      //     fix: true
      //   }
      // }
    ]
  },
  plugins: [
    // webpack 5
    // 需要安装eslint eslint-config-airbnb-base eslint-plugin-import  eslint-webpack-plugin
    new EslintWebpackPlugin({
      fix: true,
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ]
}
```

## [12.js兼容性处理](https://github.com/zhangwen0424/webpack/tree/master/12.js兼容性处理)

webpack.config.js

```js 
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      /*
        js兼容性处理：babel-loader @babel/core 
          1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise高级语法不能转换
          2. 全部js兼容性处理 --> @babel/polyfill  
            js中使用，import "@babel/polyfill"
            问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
          3. 需要做兼容性处理的就做：按需加载  --> core-js
      */  
      {
        test:/\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: '3.20.2',
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3002,
    // open:true,
  }
}
```


## js压缩

// 生产环境下会自动压缩js代码

webpack.config.js

```js
module.exports = {
  mode:"production"
}
```

## [13.html压缩](https://github.com/zhangwen0424/webpack/tree/master/13.html压缩)

webpack.config.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");

module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      }
    })
  ]
}
```

## [14.生产环境配置](https://github.com/zhangwen0424/webpack/tree/master/14.生产环境配置)

webpack.config.js
```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");


const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options:{
      postcssOptions: {
        plugins: ()=>[require("postcss-preset-env")]
      }
    }
  }
]
module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build'),
    publicPath: 'media',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader']
      },
      /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          // 优先执行 enforce: 'pre'
          先执行eslint 在执行babel
      */
     {
       test: /\.html$/,
       use: 'html-loader',
     },
    ]
  },
  plugins: [
    new ESLintWebpackPlugin({
      fix: true,
      exclude: '/node_modules/'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new OptimizeCssAssetsPlugin(),
  ],
  devServer: {
    static: resolve(__dirname, 'build'),
    port: 30001,
    compress: true,
    // open:true
  }
}
```

## webpack优化环境配置

```md
# webpack性能优化
* 开发环境性能优化
* 生产环境性能优化

## 开发环境性能优化
* 优化打包构建速度
  * HMR
* 优化代码调试
  * source-map

## 生产环境性能优化
* 优化打包构建速度
  * oneOf
  * babel缓存
  * 多进程打包
  * externals
  * dll
* 优化代码运行的性能
  * 缓存(hash-chunkhash-contenthash)
  * tree shaking
  * code split
  * 懒加载/预加载
  * pwa
```

## [15.HMR热模块替换](https://github.com/zhangwen0424/webpack/tree/master/15.HMR热模块替换)

webpack.config.js

```js
/*
  HMR: hot module replacement 热模块替换 / 模块热替换
    作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块） 
      极大提升构建速度
      
      样式文件：可以使用HMR功能：因为style-loader内部实现了~
      js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
        注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
            if (module.hot) {
              // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
              module.hot.accept('./print.js', function() {
                // 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
                // 会执行后面的回调函数
                print();
              });
            }
      html文件: 默认不能使用HMR功能.同时会导致问题：html文件不能热更新了~ （不用做HMR功能）
        解决：修改entry入口，将html文件引入
            entry: ['./src/js/index.js', './src/index.html'],
*/
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: ['./src/js/index.js', './src/index.html'],
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        // 处理css资源
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      },
      {
        // 处理less资源
        test: /\.less/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)/,
        type: 'asset/resource',
        generator: {
          filename: 'imgs/[name].[hash:6][ext]'
        }
      },
      {
        // 处理html中img资源
        test: /\.html/,
        use: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3001,
    open: true,
    // 开启HMR功能
    // 当修改了webpack配置，新配置要想生效，必须重新webpack服务
    hot: true,
  }
}
```


## [16.source-map代码映射](https://github.com/zhangwen0424/webpack/tree/master/16.source-map代码映射)

webpack.config.js

```js
/*
  source-map: 一种 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）

    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

    source-map：外部
      错误代码准确信息 和 源代码的错误位置
    inline-source-map：内联
      只生成一个内联source-map
      错误代码准确信息 和 源代码的错误位置
    hidden-source-map：外部
      错误代码错误原因，但是没有错误位置
      不能追踪源代码错误，只能提示到构建后代码的错误位置
    eval-source-map：内联
      每一个文件都生成对应的source-map，都在eval
      错误代码准确信息 和 源代码的错误位置
    nosources-source-map：外部
      错误代码准确信息, 但是没有任何源代码信息
    cheap-source-map：外部
      错误代码准确信息 和 源代码的错误位置 
      只能精确的行
    cheap-module-source-map：外部
      错误代码准确信息 和 源代码的错误位置 
      module会将loader的source map加入

    内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

    开发环境：速度快，调试更友好
      速度快(eval>inline>cheap>...)
        eval-cheap-souce-map
        eval-source-map
      调试更友好  
        souce-map
        cheap-module-souce-map
        cheap-souce-map

      --> eval-source-map  / eval-cheap-module-souce-map

    生产环境：源代码要不要隐藏? 调试要不要更友好
      内联会让代码体积变大，所以在生产环境不用内联
      nosources-source-map 全部隐藏
      hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

      --> source-map / cheap-module-souce-map
*/
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: ['./src/js/index.js', './src/index.html'],
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        // 处理css资源
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      },
      {
        // 处理less资源
        test: /\.less/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)/,
        type: 'asset/resource',
        generator: {
          filename: 'imgs/[name].[hash:6][ext]'
        }
      },
      {
        // 处理html中img资源
        test: /\.html/,
        use: 'html-loader'
      }
    ]
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3001,
    // open: true,
    // 开启HMR功能
    // 当修改了webpack配置，新配置要想生效，必须重新webpack服务
    hot: true,
  }
}
```

## [17.oneOf只匹配一个规则](https://github.com/zhangwen0424/webpack/tree/master/17.oneOf只匹配一个规则)

webpack.config.js

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: ['./src/js/index.js', './src/index.html'],
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        // 以下loader只会匹配一个
        // 注意：不能有两个配置处理同一种类型文件
        oneOf:[
          {
            // 处理css资源
            test: /\.css/,
            use: ['style-loader', 'css-loader']
          },
          {
            // 处理less资源
            test: /\.less/,
            use: ['style-loader', 'css-loader', 'less-loader']
          },
        ]
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)/,
        type: 'asset/resource',
        generator: {
          filename: 'imgs/[name].[hash:6][ext]'
        }
      },
      {
        // 处理html中img资源
        test: /\.html/,
        use: 'html-loader'
      }
    ]
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3002,
    open: true,
    // 开启HMR功能
    // 当修改了webpack配置，新配置要想生效，必须重新webpack服务
    hot: true,
  }
}
```


## [18.缓存](https://github.com/zhangwen0424/webpack/tree/master/18.缓存)

webpack.config.js

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
/*
  缓存：
    babel缓存
      cacheDirectory: true
      --> 让第二次打包构建速度更快
    文件资源缓存
      hash: 每次wepack构建时会生成一个唯一的hash值。
        问题: 因为js和css同时使用一个hash值。
          如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
      chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
        问题: js和css的hash值还是一样的
          因为css是在js中被引入的，所以同属于一个chunk
      contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样    
      --> 让代码上线运行缓存更好使用
*/

const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ()=>[require("postcss-preset-env")]
      }
    }
  }
]
module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'js/[name].[contenthash:5].js',
    path: resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader]
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, 'less-loader']
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets:  [
            [
              '@babel/preset-env',
              {
                useBuiltIns: "usage",
                corejs: {
                  version:3
                },
                targets: {
                  chrome: '60',
                    firefox: '60',
                    ie: '9',
                    safari: '10',
                    edge: '17'
                }
              }
            ]
          ],
          // 开启babel缓存
          // 第二次构建时，会读取之前的缓存
          cacheDirectory: true
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:5].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      }
    }),
    new OptimizeCssAssetsPlugin(),
  ],
}
```
server.js

```js
/*
  服务器代码
  启动服务器指令：
    npm i nodemon -g
    nodemon server.js

    node server.js
  访问服务器地址：
    http://localhost:3000

*/

const express = require("express");

const app = express();

// express.static向外暴露静态资源
// maxAge 资源缓存的最大时间，单位ms
app.use(express.static('build', {maxAge:1000*3600}))
app.listen(3002)
```
