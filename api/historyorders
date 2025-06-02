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
      database: 'test999'  // 确保连接的是正确的数据库
    });

    // 查询 orders 表的数据
    const [orderRows] = await connection.execute(
      `SELECT 
        o.id AS order_id, 
        o.timestamp AS order_timestamp, 
        o.total AS order_total, 
        o.items AS order_items
       FROM orders o
       WHERE o.account = ?`, 
      [account]
    );

    await connection.end();

    if (orderRows.length === 0) {
      return res.status(404).json({ message: '未找到订单记录' });
    }

    // 将 orders 数据映射为历史订单接口所需要的字段
    const mappedData = orderRows.map(order => {
      // 解析 items 字段
      let transactionName = '未知商品';

      try {
        const items = JSON.parse(order.order_items);
        if (Array.isArray(items)) {
          // 创建一个包含商品名称和数量的字符串
          transactionName = items.map(item => `${item.product} x${item.quantity}`).join(', ');
        }
      } catch (error) {
        console.error('items 字段解析失败', error);
      }

      return {
        id: order.order_id,                // 映射 id
        订单时间: new Date(order.order_timestamp).toISOString(),  // 映射 timestamp，转换为时间格式
        account,                           // 直接使用 account
        交易名称: transactionName,  // 生成的交易名称
        // 如果 items 需要特定格式，可以进行进一步处理，这里假设返回原始 items
        items: order.order_items 
      };
    });

    return res.status(200).json({ message: '查询成功', data: mappedData });
  } catch (error) {
    return res.status(500).json({ message: '查询失败', error: error.message });
  }
}
