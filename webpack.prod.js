const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
        `...`, // extends existing minimizers (i.e. `terser-webpack-plugin`)
        new CssMinimizerPlugin(),
    ],
  },
});