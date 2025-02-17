const {Pool} = require('pg');
require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false  // or { rejectUnauthorized: false } if SSL is required
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DB Connection Failed:', err.message);
    } else {
        console.log('DB Connected Successfully:', res.rows);
    }
});

module.exports = pool;
