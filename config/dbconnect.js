const mysql = require('mysql2/promise');
const conn = mysql.createPool({
    host : process.env.DBHOST ||'localhost',
    port : process.env.DBPORT ||'localhost',
    user : process.env.DBUSER || 'wni_admin',
    password : process.env.DBPASS || 'password',
    database : process.env.DBDATA || 'db_mon'
});

module.exports = conn;