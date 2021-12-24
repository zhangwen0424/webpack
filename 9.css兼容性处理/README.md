# 9.css兼容性处理

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