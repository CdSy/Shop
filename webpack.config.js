'use strict';

// Modules
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var _ = require('lodash');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest ? void 0 : {
    app: './src/app/app.es6'
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = isTest ? {} : {
    // Absolute output directory
    path: __dirname + '/dist',

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '/' : 'http://localhost:8080/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isTest) {
    config.devtool = 'inline-source-map';
  }
  else if (isProd) {
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'eval-source-map';
  }

  const generateSourcemaps = !isProd ? true : false;

  const imgLoaders = [
    { loader: 'url-loader', options: {
        name: 'images/[hash].[ext]',
        limit: isProd ? 10000 : 1
    }},
    { loader: 'img-loader',
        options: {
          enabled: isProd,
          gifsicle: { interlaced: false },
          mozjpeg: {
              progressive: true,
              arithmetic: false
          },
          optipng: false, // {optimizationLevel: 5},
          pngquant: {
              floyd: 0.5,
              speed: 2
          },
          svgo: {
            floatPrecision: 3,
            plugins: [
              { cleanupAttrs: true },
              { cleanupEnableBackground: true },
              { cleanupIDs: true },
              { cleanupListOfValues: false },
              { cleanupNumericValues: true },
              { collapseGroups: true },
              { convertColors: true },
              { convertPathData: true },
              { convertShapeToPath: true },
              { convertStyleToAttrs: true },
              { convertTransform: true },
              { mergePaths: true },
              { moveElemsAttrsToGroup: true },
              { moveGroupAttrsToElems: true },
              { removeComments: true },
              { removeDesc: true },
              { removeDimensions: false },
              { removeDoctype: true },
              { removeEditorsNSData: true },
              { removeEmptyAttrs: true },
              { removeEmptyContainers: true },
              { removeEmptyText: true },
              { removeHiddenElems: true },
              { removeMetadata: true },
              { removeNonInheritableGroupAttrs: true },
              { removeRasterImages: false },
              { removeTitle: false },
              { removeUnknownsAndDefaults: true },
              { removeUnusedNS: true },
              { removeUselessDefs: true },
              { removeUselessStrokeAndFill: true },
              { removeViewBox: false },
              { removeXMLProcInst: true },
              { sortAttrs: false },
              { transformsWithOnePath: false }
          ]
        }
      }
    }
  ];

  const cssLoaders = [
    { loader: 'style-loader',   options: { sourceMap: generateSourcemaps } },
    { loader: 'css-loader',     options: { sourceMap: generateSourcemaps } },
    { loader: 'postcss-loader', options: {
        sourceMap: generateSourcemaps,
        autoprefixer: {
            browsers: '>= 5%'
        },
        cssnano: false // moved to OptimizeCSSAssetsPlugin
    } },
  ];

  if (isProd) {
      cssLoaders.unshift(ExtractTextPlugin.loader({ remove: true, omit: 1 }));
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [{
      test: /\.(js|es6)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      ],
    }, {
      // CSS LOADER
      // Reference: https://github.com/webpack/css-loader
      // Allow loading css through js
      //
      // Reference: https://github.com/postcss/postcss-loader
      // Postprocess your css with PostCSS plugins
      test: /\.css$/,
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files in production builds
      //
      // Reference: https://github.com/webpack/style-loader
      // Use style-loader in development.

      loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          {loader: 'css-loader', query: {sourceMap: true}},
          {loader: 'postcss-loader'}
        ],
      })
    }, 
    { test: /\.less$/i, loaders: cssLoaders.concat([{ loader: 'less-loader', options: { sourceMap: generateSourcemaps } }]) },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }, 
    // {
    //   // ASSET LOADER
    //   // Reference: https://github.com/webpack/file-loader
    //   // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
    //   // Rename the file using the asset hash
    //   // Pass along the updated reference to your code
    //   // You can add here any file extension you want to get copied to your output
    //   test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
    //   loader: 'file-loader'
    // },
    { test: /\.(svg)(|\?[^!]*?)$/i, include: /[\/\\](?:web|)fonts?[\/\\]/i, loader: 'file-loader?name=fonts/[name].[hash:7].[ext]' },
    // { test: /(?:\.(woff|woff2|eot|ttf|otf))(|\?[^!]*?)$/i, loader: 'file-loader?name=fonts/[name].[hash:7].[ext]' },
    {test: /\.(woff|woff2|eot|ttf)$/i, loader: 'url-loader'},
    { test: /\.(jpe?g|png|gif)(|\?[^!]*?)$/i, loaders: imgLoaders },
    {
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      // Allow loading html through js
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  };

  config.resolve = {
    modules: [
      path.join(__dirname, './node_modules')
    ]
  };

  // ISTANBUL LOADER
  // https://github.com/deepsweet/istanbul-instrumenter-loader
  // Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
  // Skips node_modules and files that end with .spec.js
  if (isTest) {
    config.module.rules.push({
      enforce: 'pre',
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.spec\.js$/
      ],
      loader: 'istanbul-instrumenter-loader',
      query: {
        esModules: true
      }
    })
  }

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
   // NOTE: This is now handled in the `postcss.config.js`
   //       webpack2 has some issues, making the config file necessary

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // new webpack.LoaderOptionsPlugin({
    //   test: /\.scss$/i,
    //   options: {
    //     postcss: {
    //       plugins: [autoprefixer]
    //     }
    //   }
    // }),

    new webpack.ProvidePlugin({
      _: 'lodash',
    })
  ];

  // Skip rendering index.html in test mode
  if (!isTest) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/public/index.html',
        inject: 'body'
      }),

      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files
      // Disabled when in test mode or not in build mode
      new ExtractTextPlugin({filename: 'css/[name].css', disable: !isProd, allChunks: true})
    )
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      // new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      // new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({minimize: true}),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public/img',
        to: __dirname + '/img'
      }]),
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public/icons',
        to: __dirname + '/icons'
      }])
    )
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal'
  };

  return config;
}();
