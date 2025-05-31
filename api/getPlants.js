import mysql from 'mysql2';

export default async function handler(req, res) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,  // 阿里云 DMS 主机
    user: process.env.DB_USER,  // 数据库用户名
    password: process.env.DB_PASSWORD,  // 数据库密码
    database: 'test999'  // 数据库名
  });

  // 建立连接并执行查询
  connection.connect((err) => {
    if (err) {
      return res.status(500).json({ message: 'Database connection failed', error: err.message });
    }

    // 查询 `plant` 表的所有数据
    const sqlQuery = 'SELECT * FROM plant';
    
    connection.query(sqlQuery, (error, results) => {
      if (error) {
        connection.end();
        return res.status(500).json({ message: 'Query failed', error: error.message });
      }

      // 返回查询结果
      res.status(200).json(results);
      connection.end();
    });
  });
}
