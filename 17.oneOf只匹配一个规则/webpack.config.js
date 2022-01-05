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