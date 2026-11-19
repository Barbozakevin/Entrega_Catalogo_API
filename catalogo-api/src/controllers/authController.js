const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (![name, email, password].every(v => typeof v === 'string' && v.trim())) return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailPattern.test(normalizedEmail)) return res.status(400).json({ error: 'El correo no tiene un formato válido.' });
    if (password.length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
    const passwordHash = await bcrypt.hash(password, rounds);
    const { rows } = await db.query(
      'INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,\'usuario\') RETURNING id,name,email,role,created_at',
      [name.trim(), normalizedEmail, passwordHash]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
}
async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    const { rows } = await db.query('SELECT id,name,email,password_hash,role FROM users WHERE email=$1', [email.trim().toLowerCase()]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ error: 'Credenciales incorrectas.' });
    const user = rows[0];
    const token = jwt.sign({ sub: String(user.id), role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    res.status(200).json({ data: { token, token_type: 'Bearer', expires_in: process.env.JWT_EXPIRES_IN || '1h', user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) { next(err); }
}
module.exports = { register, login };
