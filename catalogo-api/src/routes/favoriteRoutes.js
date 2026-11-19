const router = require('express').Router();
const controller = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');
router.use(authenticate);
router.get('/', controller.list);
router.post('/', controller.add);
router.delete('/:productoId', controller.remove);
module.exports = router;
