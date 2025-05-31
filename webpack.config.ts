const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

const path = require('path');
const publicPath = path.resolve(__dirname, 'public');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = (env: any) => {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: './public/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      chunkFilename: isProduction ? 'js/[name].[contenthash].chunk.js' : 'js/[name].chunk.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-typescript']
            }
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
          test: /\.css$/,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/,
          type: 'asset',
          generator: {
            filename: 'img/[name].[hash][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8192
            }
          }
        }
      ]
    },
    plugins: [
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash].css',
              chunkFilename: 'css/[name].[contenthash].chunk.css'
            })
          ]
        : []),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(publicPath, 'static'),
            to: path.resolve(__dirname, 'dist'),
            globOptions: {
              ignore: ['**/img/**']
            }
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(publicPath, 'index.html'),
        filename: 'index.html',
        inject: 'body',
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true
            }
          : false
      }),

      ...(isProduction
        ? [
            new CompressionPlugin({
              filename: '[path][base].gz',
              algorithm: 'gzip',
              test: /\.(js|css|html|svg)$/,
              threshold: 8192,
              minRatio: 0.8,
              deleteOriginalAssets: false
            }),

            new CompressionPlugin({
              filename: '[path][base].br',
              algorithm: 'brotliCompress',
              test: /\.(js|css|html|svg)$/,
              compressionOptions: {
                params: {
                  [zlib.constants.BROTLI_PARAM_QUALITY]: 11
                }
              },
              threshold: 8192,
              minRatio: 0.8,
              deleteOriginalAssets: false
            })
          ]
        : []),

      ...(env?.analyze ? [new BundleAnalyzerPlugin({ openAnalyzer: true })] : [])
    ],
    devServer: {
      static: publicPath,
      compress: true,
      port: 3000,
      hot: true,
      historyApiFallback: true
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info']
            },
            mangle: true,
            format: {
              comments: false
            }
          },
          extractComments: false
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      },
      runtimeChunk: 'single'
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
};
