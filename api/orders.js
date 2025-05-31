import mysql from 'mysql2/promise';
import { verifyToken } from './jwt';  // 引入你之前定义的 verifyToken 函数

export default async function handler(req, res) {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end(); // 预检请求响应

  if (req.method !== 'GET') {
    return res.status(405).json({ message: '只支持 GET 请求' });
  }

  // 验证 JWT token
  const payload = verifyToken(req);
  if (!payload) {
    return res.status(401).json({ message: '未授权访问' });
  }

  const account = payload.account;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    // 查询历史订单
    const [rows] = await connection.execute(
      'SELECT id, 订单时间, account, 交易名称 FROM orders WHERE account = ?',
      [account]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: '没有找到历史订单' });
    }

    return res.status(200).json({ message: '查询成功', data: rows });
  } catch (error) {
    return res.status(500).json({ message: '查询失败', error: error.message });
  }
}
