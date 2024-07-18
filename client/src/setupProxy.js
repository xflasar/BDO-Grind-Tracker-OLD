const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:443',
      changeOrigin: true,
      secure: false, // should be true if target is https
    })
  )
}
