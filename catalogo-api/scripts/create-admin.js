require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/config/db');
(async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) throw new Error('Configura ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres) en .env');
  const hash = await bcrypt.hash(ADMIN_PASSWORD, Number(process.env.BCRYPT_ROUNDS || 12));
  const result = await db.query(`INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,'administrador') ON CONFLICT(email) DO NOTHING RETURNING id,email,role`, [ADMIN_NAME.trim(), ADMIN_EMAIL.trim().toLowerCase(), hash]);
  console.log(result.rowCount ? `Administrador creado: ${result.rows[0].email}` : 'Ese correo ya existe; no se modificó ningún usuario.');
})().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(() => db.pool.end());
