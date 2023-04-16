
const {koneksi} = require("../config/database")

// create data / insert data
const addPromo = async (req, res) => {
    // const data = { ...req.body };
    const data = { ...req.body}
    const querySql = 'INSERT INTO promo_provider SET ?';

    koneksi.query(querySql, data, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal insert data!', error: err });
        }

        res.status(201).json({ success: true, message: 'Berhasil insert data!' });
    });
};

// read data / get data
const getAllPromo = (req, res) => {
    const querySql = 'SELECT * FROM promo_provider WHERE isActive = 1';

    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        res.status(200).json({ success: true, data: rows });
    });
};

// update data
const cekExpiredPromo = async  (req, res) => {
    const querySql = 'UPDATE promo_provider SET isActive=0 WHERE endDate < now()';

    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        res.status(200).json({ success: true, data: rows });
    });
};

module.exports = {
	getAllPromo,
	addPromo,
	cekExpiredPromo
}

// // create data / insert data
// app.post('/promo', (req, res) => {
//     const data = { ...req.body };
//     const querySql = 'INSERT INTO promo_provider SET ?';

//     koneksi.query(querySql, data, (err, rows, field) => {
//         if (err) {
//             return res.status(500).json({ message: 'Gagal insert data!', error: err });
//         }

//         res.status(201).json({ success: true, message: 'Berhasil insert data!' });
//     });
// });

// // read data / get data
// app.get('/promo', (req, res) => {
//     const querySql = 'SELECT * FROM promo_provider WHERE isActive = 1';

//     koneksi.query(querySql, (err, rows, field) => {
//         if (err) {
//             return res.status(500).json({ message: 'Ada kesalahan', error: err });
//         }

//         res.status(200).json({ success: true, data: rows });
//     });
// });

// // update data
// app.get('/cek-expired-promo', (req, res) => {
//     const querySql = 'UPDATE promo_provider SET isActive=0 WHERE endDate < now()';

//     koneksi.query(querySql, (err, rows, field) => {
//         if (err) {
//             return res.status(500).json({ message: 'Ada kesalahan', error: err });
//         }

//         res.status(200).json({ success: true, data: rows });
//     });
// });