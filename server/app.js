import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';
import express from 'express';
import serveStatic from 'serve-static';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';

const PORT = 4000;

// 获取本机IP地址列表
const nets = networkInterfaces();
const ipMap = Object.create(null);
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      if (!ipMap[name]) {
        ipMap[name] = [];
      }
      ipMap[name].push(net.address);
    }
  }
}

const app = express();

app.use(history());

const rootPath = path.join(dirname(fileURLToPath(import.meta.url)), 'public');
app.use(serveStatic(rootPath));

const proxy = createProxyMiddleware('/api', {
  // target: 'http://ajecloud.anjieservice.com/', // 生产环境
  target: 'http://10.143.1.135:8801/', // 测试环境
  changeOrigin: true,
});

app.use('/api', proxy);

app.listen(PORT, function () {
  console.log('\u001b[1mLocal:  \u001b[0m', `\x1B[36mhttp://localhost:${PORT}/\x1B[0m`);
  Object.keys(ipMap).forEach((item) => {
    console.log('\u001b[1mNetwork:\u001b[0m', `\x1B[36mhttp://${ipMap[item]}:${PORT}/\x1B[0m`);
  });
});
