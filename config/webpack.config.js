const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { getPageEntry, getHtmlPluginEntry } = require('./webpack.util')

module.exports = {
  entry: getPageEntry,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]/index.[chunkhash].js', // filename 指列在 entry 中，打包后输出的文件的名称
    chunkFilename: '[name]/[name].[chunkhash].js', // chunkFilename 指未列在 entry 中，却又需要被打包出来的文件的名称
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          /**
           * loader 是从右到左执行，顺序不能颠倒
           * 1. 最先执行 sass-loader ，将 sass 文件转为css
           * 2. css-loader 将转换后的css文件转为 js模块
           * 3. style-loader 将 css 插入到HTML中的<style>标签中
           */
          // 'style-loader', // 将 JS 字符串生成为 style 节点
          MiniCssExtractPlugin.loader, // 不可与style-loader同时使用
          {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader', // 处理兼容，px2rem等
          'sass-loader', // 将 Sass 编译成 CSS
          {
            // 全局sass资源
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, '../', 'src/assets/styles/global.scss'),
              ],
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: /src/,
      },
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...getHtmlPluginEntry(),
    new MiniCssExtractPlugin({
      filename: '[name]/index.[contenthash].css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
  },
}
