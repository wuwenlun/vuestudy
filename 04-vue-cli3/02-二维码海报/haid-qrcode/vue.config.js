module.exports = {
  outputDir: 'dist',
  publicPath: '/',
  devServer: {
    proxy: {
      '/rest': {
        target: 'http://localhost:9999',//测试服务器
        ws: true,
        changeOrigin: true,
        secure: false,  // 如果是https接口，需要配置这个参数
      }
    }
  }

};
