import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { id, plantname, price, instock } = req.body;

    if (!id || plantname == null || price == null || instock == null) {
      return res.status(400).json({ message: '参数缺失：id, plantname, price, instock 必填' });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    const [result] = await connection.execute(
      'UPDATE `sale message` SET plantname = ?, price = ?, `instock` = ? WHERE id = ?',
      [plantname, price, instock, id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '未找到对应记录或未更新' });
    }

    res.status(200).json({ message: '更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
}
