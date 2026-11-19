const db = require('../config/db');
const validId = value => /^\d+$/.test(String(value)) && Number(value) > 0;
function validateProduct(body) {
  const { name, description, category, price } = body || {};
  if (![name, description, category].every(v => typeof v === 'string' && v.trim()) || price === undefined || price === null || price === '') return 'Nombre, descripción, categoría y precio son obligatorios.';
  if (!Number.isFinite(Number(price)) || Number(price) <= 0) return 'El precio debe ser un número mayor que cero.';
  return null;
}
async function list(req, res, next) {
  try {
    const category = typeof req.query.categoria === 'string' ? req.query.categoria.trim() : '';
    const result = category
      ? await db.query('SELECT id,name,description,category,price,created_at,updated_at FROM products WHERE LOWER(category)=LOWER($1) ORDER BY id', [category])
      : await db.query('SELECT id,name,description,category,price,created_at,updated_at FROM products ORDER BY id');
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}
async function getOne(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
    const { rows } = await db.query('SELECT id,name,description,category,price,created_at,updated_at FROM products WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
}
async function create(req, res, next) {
  try {
    const issue = validateProduct(req.body); if (issue) return res.status(400).json({ error: issue });
    const { name, description, category, price } = req.body;
    const { rows } = await db.query('INSERT INTO products(name,description,category,price) VALUES($1,$2,$3,$4) RETURNING id,name,description,category,price,created_at,updated_at', [name.trim(), description.trim(), category.trim(), Number(price)]);
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
}
async function update(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
    const issue = validateProduct(req.body); if (issue) return res.status(400).json({ error: issue });
    const { name, description, category, price } = req.body;
    const { rows } = await db.query('UPDATE products SET name=$1,description=$2,category=$3,price=$4,updated_at=NOW() WHERE id=$5 RETURNING id,name,description,category,price,created_at,updated_at', [name.trim(), description.trim(), category.trim(), Number(price), req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
    const { rowCount } = await db.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.status(204).end();
  } catch (err) { next(err); }
}
module.exports = { list, getOne, create, update, remove };
