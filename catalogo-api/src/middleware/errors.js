function notFound(req, res) { res.status(404).json({ error: 'Ruta no encontrada.' }); }
function errorHandler(err, req, res, next) {
  console.error(err.message);
  if (err.code === '23505') return res.status(409).json({ error: 'El registro ya existe.' });
  if (err.code === '23503') return res.status(404).json({ error: 'La referencia solicitada no existe.' });
  if (err.code === '23514' || err.code === '22P02') return res.status(400).json({ error: 'Los datos enviados no son válidos.' });
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Error interno del servidor.' });
}
module.exports = { notFound, errorHandler };
