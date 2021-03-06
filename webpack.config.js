const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");

const pug = require("./webpack/pug");
const devServer = require("./webpack/devserver");
const sass = require("./webpack/sass");
const css = require("./webpack/css");
const extractCSS = require("./webpack/css.extract");
const uglifyJS = require("./webpack/js.uglify");
const images = require("./webpack/images");
const audio = require("./webpack/audio");
const babel = require("./webpack/babel");
const clean = require("./webpack/clean");
const glsl = require("./webpack/glsl");

const sourcePath = path.join(__dirname, "src");
const distPath = path.join(__dirname, "dist");

const PATHS = {
  src: {
    js: sourcePath + "/js",
    jade: sourcePath + "/template",
    scss: sourcePath + "/scss",
  },

  dist: {
    js: distPath + "/js"
  }
};

process.noDeprecation = true;

const common = merge([
  {
    devtool: "source-map",

    entry: PATHS.src.js + "/app.js",

    output: {
      path: distPath,
      filename: "js/[name].js"
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: PATHS.src.jade + "/index.pug",
        filename: "index.html"
      }),

      // new webpack.optimize.CommonsChunkPlugin({
      //   name: "common"
      // }),

      // new ExtractTextPlugin('css/main.css'),

      new webpack.ProvidePlugin({
        'window.jQuery'    : 'jquery',
        'window.$'         : 'jquery',
        'jQuery'           : 'jquery',
        '$'                : 'jquery'
      })
    ]
  },
  pug(),
  images(),
  glsl()
]);


module.exports = function (env) {
  if (env === "production")
  {
    return merge([
      clean([
        "dist",
      ], {
        root: __dirname,
        verbose: true,
        dry: false
      }),
      common,
      extractCSS(),
      babel(),
      uglifyJS(),
      audio()
    ]);
  }

  if (env === "development")
  {
    return merge([
      common,
      devServer(),
      sass(),
      css(),
      audio()
      // extractCSS()
    ]);
  }
};