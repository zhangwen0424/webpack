/*
 * @Date: 2021-09-24 16:33:33
 * @LastEditors: zhangwen
 * @LastEditTime: 2021-12-23 13:37:36
 * @FilePath: /webpack/4.webpack打包图片资源/webpack.config.js
 */
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