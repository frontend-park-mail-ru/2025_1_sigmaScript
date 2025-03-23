const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

module.exports = {
  entry: path.join(publicPath, 'index.js'),
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(publicPath, 'index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css'
    }),
    new TsCheckerPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(publicPath, 'static/img'), to: 'img' }]
    })
  ].filter(Boolean),

  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules|\.precompiled\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      components: path.join(publicPath, 'components'),
      pages: path.join(publicPath, 'pages'),
      static: path.join(publicPath, 'static'),
      utils: path.join(publicPath, 'utils'),
      types: path.join(publicPath, 'types'),
      public: publicPath
    }
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    watchFiles: publicPath,
    client: {
      overlay: false
    }
  }
};
