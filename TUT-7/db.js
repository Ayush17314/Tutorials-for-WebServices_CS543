const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'DB_PASS',
    database: 'TUT7',
});

module.exports = pool;