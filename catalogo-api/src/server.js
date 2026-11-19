require('dotenv').config();
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error('Configura DATABASE_URL y JWT_SECRET en .env');
  process.exit(1);
}
const app = require('./app');
const { pool } = require('./config/db');
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => console.log(`API disponible en http://localhost:${port}`));
async function shutdown() {
  server.close(async () => { await pool.end(); process.exit(0); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
