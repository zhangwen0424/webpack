# 15.HMR热模块替换

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