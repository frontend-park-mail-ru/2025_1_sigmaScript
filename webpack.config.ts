const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const publicPath = path.resolve(__dirname, 'public');

module.exports = {
  entry: './public/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader'
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|webp|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name]-[contenthash].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(publicPath, 'static/img'),
          to: path.resolve(__dirname, 'dist/img')
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(publicPath, 'index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  devServer: {
    static: publicPath,
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      components: path.resolve(publicPath, 'components'),
      pages: path.resolve(publicPath, 'pages'),
      static: path.resolve(publicPath, 'static'),
      types: path.resolve(publicPath, 'types'),
      utils: path.resolve(publicPath, 'utils'),
      flux: path.resolve(publicPath, 'flux'),
      store: path.resolve(publicPath, 'store'),
      modules: path.resolve(publicPath, 'modules'),
      public: publicPath
    }
  }
};
