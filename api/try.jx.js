const http = require('http');

const data = JSON.stringify({
  name: "rose",
  password: "123456",
  account: 10001
});

const options = {
  hostname: 'new2-gules.vercel.app',  // 替换成你的实际 Vercel 部署地址
  port: 443,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let responseData = '';

  console.log(`状态码: ${res.statusCode}`);

  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('返回数据:', responseData);
  });
});

req.on('error', error => {
  console.error('请求错误:', error);
});

req.write(data);
req.end();
