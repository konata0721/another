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

  const { id, plantname, ownername, price, owneraccount } = req.body;

  if (
    id === undefined ||
    plantname === undefined ||
    ownername === undefined ||
    price === undefined ||
    owneraccount === undefined
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'test999'
    });

    const sql = 'INSERT INTO `sale message` (id, plantname, ownername, price, owneraccount) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(sql, [id, plantname, ownername, price, owneraccount]);

    res.status(201).json({ message: 'Sale message inserted successfully', data: result });
    await connection.end();
  } catch (error) {
    res.status(500).json({ message: 'Insertion failed', error: error.message });
  }
}
