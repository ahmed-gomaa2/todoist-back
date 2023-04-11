const mysql = require('mysql');
require('dotenv').config('../../.env');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB_NAME,
    debug: true,
    logging: true
});


connection.connect(err => {
    if(err) console.log(err);
});

module.exports = connection;