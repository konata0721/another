import mysql from 'mysql2/promise';
import { verifyToken } from './jwt'; // 用于校验 JWT

export default async function handler(req, res) {
  // 设置 CORS 头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持 POST 请求' });
  }

  // 验证 JWT
  const payload = verifyToken(req);
  if (!payload) {
    return res.status(401).json({ message: '未授权访问' });
  }

  const account = payload.account;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: '缺少 oldPassword 或 newPassword 参数' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    // 查找原密码是否正确
    const [rows] = await connection.execute(
      'SELECT password FROM login WHERE account = ?',
      [account]
    );

    const user = rows[0];
    if (!user || user.password !== oldPassword) {
      await connection.end();
      return res.status(401).json({ message: '原密码错误' });
    }

    // 更新新密码
    await connection.execute(
      'UPDATE login SET password = ? WHERE account = ?',
      [newPassword, account]
    );

    await connection.end();
    return res.status(200).json({ message: '密码修改成功' });

  } catch (error) {
    console.error('修改密码出错:', error);
    return res.status(500).json({ message: '服务器错误', error: error.message });
  }
}
