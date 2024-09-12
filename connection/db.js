const mysql = require('mysql2');

const conn = mysql.createConnection({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "hello"
});

conn.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        return;
    }
    // conn.query(`create table otp(id int primary key Auto_increment,otp varchar(200))`)
    console.log('Connected to the database');
});

module.exports = conn;
