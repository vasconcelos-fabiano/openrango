const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use((req, res, next) => {
  console.log('PROXY:', req.method, req.originalUrl, 'PATH:', req.url);
  next();
});

app.use(
  createProxyMiddleware({
    changeOrigin: true,
    ws: true,
    router: (req) =>
      req.url.startsWith('/dev')
        ? 'http://localhost:4202'
        : 'http://localhost:4201',
  })
);

app.listen(4200, () => {
  console.log('OpenRango: http://localhost:4200');
});