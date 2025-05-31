import mysql from 'mysql2/promise';
import { verifyToken } from './jwt';  // 确保你已经实现了这个函数

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '只支持 GET 请求' });
  }

  // 验证 JWT
  const payload = verifyToken(req);
  if (!payload) {
    return res.status(401).json({ message: '未授权访问' });
  }

  const account = payload.account;

  try {
    // 连接数据库
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    // 查询 personalmessage 表
    const [rows] = await connection.execute(
      'SELECT * FROM personalmessage WHERE account = ?',
      [account]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到用户信息' });
    }

    return res.status(200).json({ message: '查询成功', data: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: '查询失败', error: error.message });
  }
}
