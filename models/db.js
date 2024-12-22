const {Pool} = require('pg');
require('dotenv').config();

// to create a database either her or through postbird 

const pool = new Pool (
    {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false, // Add this to bypass self-signed certificates
        },
    }
);

module.exports = pool;
