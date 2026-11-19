const db = require('../config/db');
const validId = value => /^\d+$/.test(String(value)) && Number(value) > 0;
async function list(req, res, next) {
  try {
    const { rows } = await db.query(`SELECT p.id,p.name,p.description,p.category,p.price,f.created_at AS favorited_at
      FROM favorites f JOIN products p ON p.id=f.product_id WHERE f.user_id=$1 ORDER BY f.created_at DESC`, [req.user.sub]);
    res.json({ data: rows });
  } catch (err) { next(err); }
}
async function add(req, res, next) {
  try {
    const { productoId } = req.body || {};
    if (!validId(productoId)) return res.status(400).json({ error: 'productoId debe ser un entero positivo.' });
    const product = await db.query('SELECT id FROM products WHERE id=$1', [productoId]);
    if (!product.rowCount) return res.status(404).json({ error: 'Producto no encontrado.' });
    const result = await db.query('INSERT INTO favorites(user_id,product_id) VALUES($1,$2) ON CONFLICT(user_id,product_id) DO NOTHING RETURNING user_id,product_id,created_at', [req.user.sub, productoId]);
    if (!result.rowCount) return res.status(409).json({ error: 'El producto ya está en tus favoritos.' });
    res.status(201).json({ data: result.rows[0] });
  } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try {
    if (!validId(req.params.productoId)) return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
    const { rowCount } = await db.query('DELETE FROM favorites WHERE user_id=$1 AND product_id=$2', [req.user.sub, req.params.productoId]);
    if (!rowCount) return res.status(404).json({ error: 'Ese producto no está en tus favoritos.' });
    res.status(204).end();
  } catch (err) { next(err); }
}
module.exports = { list, add, remove };
