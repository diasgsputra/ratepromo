const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const cors = require("cors")
const PORT = process.env.PORT || 5000;
// set body parser
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create data / insert data
app.post('/promo', (req, res) => {
    const data = { ...req.body };
    const querySql = 'SELECT COUNT(*) as count FROM promo_provider WHERE name = ?';
    const queryParams = [data.name];

    koneksi.query(querySql, queryParams, (err, rows, fields) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        const count = rows[0].count;

        if (count > 0) {
            return res.status(400).json({ message: 'Promo exist' });
        }

        const insertSql = 'INSERT INTO promo_provider SET ?';

        koneksi.query(insertSql, data, (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }

            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    });
});


// read data / get data
app.get('/promo', (req, res) => {
    const querySql = 'SELECT * FROM promo_provider WHERE isActive = 1';

    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        res.status(200).json({ success: true, data: rows });
    });
});

app.get('/cek-expired-promo', (req, res) => {
    const querySql = 'UPDATE promo_provider SET isActive=0 WHERE endDate < now()';

    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        res.status(200).json({ success: true, data: rows });
    });
});

//////////////

app.post('/rate', (req, res) => {
    const { company, rate } = req.body;
    // const createdAt = 
    const data = { company, rate: JSON.stringify(rate), createdAt: new Date() };
    // const data = { ...req.body}
    const querySql = 'INSERT INTO rate SET ?';

    koneksi.query(querySql, data, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal insert data!', error: err });
        }

        res.status(201).json({ success: true, message: 'Berhasil insert data!' });
    });
});


// read data / get data
app.get('/rate', (req, res) => {
    const querySql = 'SELECT * FROM rate ORDER BY createdAt DESC LIMIT 1';

    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
        const data = rows.map(row => ({
            ...row,
            rate: JSON.parse(row.rate)
        }));
        res.status(200).json({ success: true, data: data });
    });
});



// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const routes = require('./routes/routes')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));


// app.use(routes)



app.listen(8000, () => {
	console.log('server started on port 8000');
});