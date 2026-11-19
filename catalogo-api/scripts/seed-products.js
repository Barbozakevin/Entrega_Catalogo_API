require('dotenv').config();
const db = require('../src/config/db');
const products = [
  ['Audífonos inalámbricos','Audífonos Bluetooth con estuche de carga','Tecnología',35.50],
  ['Mochila urbana','Mochila resistente para uso diario','Accesorios',28.00],
  ['Botella térmica','Botella de acero inoxidable de 750 ml','Hogar',16.75],
  ['Teclado mecánico','Teclado compacto con conexión USB','Tecnología',49.99],
  ['Lámpara de escritorio','Lámpara LED con intensidad ajustable','Hogar',22.40]
];
(async () => {
for (const p of products) await db.query('INSERT INTO products(name,description,category,price) SELECT $1::varchar(140),$2::text,$3::varchar(80),$4::numeric(12,2) WHERE NOT EXISTS (SELECT 1 FROM products WHERE name=$1::varchar(140))', p);  console.log('Productos de ejemplo cargados (sin repetir nombres existentes).');
})().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(() => db.pool.end());
