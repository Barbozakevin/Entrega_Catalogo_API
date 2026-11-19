const jwt = require('jsonwebtoken');
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Se requiere un token Bearer válido.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o vencido.' });
  }
}
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'administrador') return res.status(403).json({ error: 'Se requiere el rol administrador.' });
  next();
}
module.exports = { authenticate, requireAdmin };
