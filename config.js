require('dotenv').config();

const sortie = {};

sortie.TOKEN = process.env.TOKEN || '';

module.exports = sortie;