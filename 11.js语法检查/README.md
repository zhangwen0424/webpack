# 11.js语法检查

index.js

```js
// 下一行eslint所有规则都失效（下一行不进行eslint检查）
// eslint-disable-next-line
console.log(add(2, 5));
```

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
