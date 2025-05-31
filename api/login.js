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
    console.log("JWT_SECRET =", process.env.JWT_SECRET); // ✅调试用

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

    const token = jwt.sign(
      { account: user.account },
      process.env.JWT_SECRET, // 🔴 此处不能为 undefined
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: '登录成功', token });
  } catch (error) {
    console.error('登录失败：', error);
    return res.status(500).json({ message: '服务器错误' });
  }
}
