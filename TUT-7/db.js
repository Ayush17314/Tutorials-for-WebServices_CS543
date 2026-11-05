const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '@Ayush1504',
    database: 'TUT7',
});

module.exports = pool;