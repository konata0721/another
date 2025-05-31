import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;

  try {
    // 这里用固定密钥 konata235 验证
    return jwt.verify(token, 'konata235');
  } catch {
    return null;
  }
}
