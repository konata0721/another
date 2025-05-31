import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持 POST 请求' });
  }

  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    const [rows] = await connection.execute(
      'SELECT id, name, password, account FROM login WHERE name = ?',
      [name]
    );
    await connection.end();

    const user = rows[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 写死 JWT 密钥
    const token = jwt.sign(
      { account: user.account },
      '0d000721',  // 🔒 写死密钥
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: '登录成功', token });
  } catch (error) {
    console.error('登录失败：', error);
    return res.status(500).json({ message: '服务器错误' });
  }
}
