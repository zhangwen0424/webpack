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