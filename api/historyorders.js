import mysql from 'mysql2/promise';
import { verifyToken } from './jwt';  // 你已有的验证函数

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 限制请求方法
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '只支持 GET 请求' });
  }

  // 验证 Token
  const payload = verifyToken(req);
  if (!payload) {
    return res.status(401).json({ message: '未授权访问' });
  }

  const account = payload.account;

  try {
    // 数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    // 查询 historyorders 表
    const [rows] = await connection.execute(
      'SELECT id, `订单时间`, account, `交易名称` FROM historyorders WHERE account = ?',
      [account]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到历史订单' });
    }

    return res.status(200).json({ message: '查询成功', data: rows });
  } catch (error) {
    return res.status(500).json({ message: '查询失败', error: error.message });
  }
}
