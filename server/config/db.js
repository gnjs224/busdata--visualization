var mysql = require('mysql');
const db = mysql.createPool({
    host : '202.86.11.18',
    user : 'nipausr',
    password : 'fasolsqi',
    database : 'nipadb'
});

module.exports = db;