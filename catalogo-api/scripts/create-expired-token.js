require('dotenv').config();
const jwt = require('jsonwebtoken');
if (!process.env.JWT_SECRET) throw new Error('Configura JWT_SECRET en .env');
console.log(jwt.sign({ sub: '1', role: 'usuario' }, process.env.JWT_SECRET, { expiresIn: '-1s' }));
