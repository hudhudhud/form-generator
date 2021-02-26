const path = require('path')
var MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const minify = process.env.NODE_ENV === 'development' ? false : {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      minify
    }
  },
  devServer: {
    overlay: false
  },
  productionSourceMap: false,
  configureWebpack: config => {
    // externals: {
    //   vue: 'Vue',
    //   'vue-router': 'VueRouter',
    //   axios: 'axios',
    //   'element-ui': 'ELEMENT'
    // }
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages:["javascript","css","json"],
        features:["coreCommands","find"]
      })
    )
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
