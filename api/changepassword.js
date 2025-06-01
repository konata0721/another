import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持 POST 请求' });
  }

  const { name, oldPassword, newPassword } = req.body;
  if (!name || !oldPassword || !newPassword) {
    return res.status(400).json({ message: '用户名、旧密码和新密码不能为空' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    // 查询用户旧密码
    const [rows] = await connection.execute(
      'SELECT password FROM login WHERE name = ?',
      [name]
    );

    const user = rows[0];
    if (!user || user.password !== oldPassword) {
      await connection.end();
      return res.status(401).json({ message: '用户名或旧密码错误' });
    }

    // 更新密码
    await connection.execute(
      'UPDATE login SET password = ? WHERE name = ?',
      [newPassword, name]
    );

    await connection.end();
    return res.status(200).json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码失败：', error);
    return res.status(500).json({ message: '服务器错误' });
  }
}
