import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // 限制请求方法
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999', // 替换为你的数据库名称
    });

    // 执行查询 personalmessage 表
    const [rows] = await connection.execute('SELECT * FROM personalmessage');
    await connection.end();

    // 返回查询结果
    return res.status(200).json(rows);
  } catch (error) {
    // 返回错误信息
    return res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
    });
  }
}
