import mysql from 'mysql2/promise';
import { verifyToken } from './jwt';  // 引入验证 JWT 的函数

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const payload = verifyToken(req);
  if (!payload) return res.status(401).json({ message: '未授权访问' });

  const account = payload.account;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    const [rows] = await connection.execute(
      'SELECT * FROM `land and sensor` WHERE owneraccount = ?',
      [account]
    );

    await connection.end();
    return res.status(200).json({ message: '查询成功', data: rows });
  } catch (error) {
    return res.status(500).json({ message: '查询失败', error: error.message });
  }
}
