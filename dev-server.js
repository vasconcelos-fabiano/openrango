const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use((req, res, next) => {
  console.log('PROXY:', req.method, req.originalUrl, 'PATH:', req.url);
  next();
});

app.use(
  '/dev',
  createProxyMiddleware({
    target: 'http://localhost:4202',
    changeOrigin: true,
    pathRewrite: (path, req) => '/dev' + path,
  })
);

app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:4201',
    changeOrigin: true,
  })
);

app.listen(4200, () => {
  console.log('OpenRango: http://localhost:4200');
});