import mysql from 'mysql2';

export default async function handler(req, res) {
  // 设置 CORS 头部，允许所有来源访问
  res.setHeader('Access-Control-Allow-Origin', '*');  // 允许来自所有域的请求
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // 允许的请求方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // 允许的请求头

  // 如果是 OPTIONS 请求，直接返回成功
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id, name, soilwest, carbondioxide } = req.body;

  // 验证输入数据
  if (!id || !name || !soilwest || !carbondioxide) {
    return res.status(400).json({ message: 'Missing required fields: id, name, soilwest, carbondioxide' });
  }

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,  // 阿里云 DMS 主机
    user: process.env.DB_USER,  // 数据库用户名
    password: process.env.DB_PASSWORD,  // 数据库密码
    database: 'test999'  // 数据库名
  });

  // 建立连接并执行插入操作
  connection.connect((err) => {
    if (err) {
      return res.status(500).json({ message: 'Database connection failed', error: err.message });
    }

    // 插入数据到 `plant` 表
    const sqlQuery = 'INSERT INTO plant (id, name, soilwest, carbondioxide) VALUES (?, ?, ?, ?)';
    
    connection.query(sqlQuery, [id, name, soilwest, carbondioxide], (error, results) => {
      if (error) {
        connection.end();
        return res.status(500).json({ message: 'Insertion failed', error: error.message });
      }

      // 返回成功响应
      res.status(201).json({ message: 'Plant inserted successfully', data: results });
      connection.end();
    });
  });
}
