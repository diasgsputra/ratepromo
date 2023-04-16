const mysql = require('mysql');
// buat konfigurasi koneksi
const koneksi = mysql.createConnection({
    // host: "109.106.253.22",
    // user: "u1366518_ratepromo",
    // password: "ratepromo",
    // database: "u1366518_rate_promo",
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "db_rate_promo",
    // port: 3306,
    // host: "10.40.69.7",
    // user: "phpmyadmin",
    // password: "viapulsa@01",
    // database: "db_rate_promo",
    host: "sql12.freemysqlhosting.net",
    user: "sql12613118",
    password: "WADlKk7axY",
    database: "sql12613118",
    port: 3306,
    multipleStatements: true
});
// koneksi database
koneksi.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});
module.exports = koneksi;