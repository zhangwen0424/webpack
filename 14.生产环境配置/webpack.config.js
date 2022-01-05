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