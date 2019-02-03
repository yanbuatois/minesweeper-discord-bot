require('dotenv').config();

const sortie = {};

sortie.TOKEN = process.env.TOKEN || '';
sortie.MAXCOLS = parseInt(process.env.MAXCOLS) || 40;
sortie.MINCOLS = parseInt(process.env.MINCOLS) || 1;
sortie.MAXROWS = parseInt(process.env.MAXROWS) || 40;
sortie.MINROWS = parseInt(process.env.MINROWS) || 1;

module.exports = sortie;