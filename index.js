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
    const querySql = 'SELECT * FROM promo_provider WHERE isActive = 1 ORDER BY provider DESC';

    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
        // modify the createdAt property of each row
        rows = rows.map(row => {
          const startDate = new Date(row.startDate);
          const formattedStartDate = startDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour12: false });
          const endDate = new Date(row.endDate);
          const formattedEndDate = endDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour12: false });
          return { ...row, startDate: formattedStartDate, endDate: formattedEndDate };
        });

        res.status(200).json({ success: true, data: rows });
    });
});

app.get('/cek-expired-promo', (req, res) => {
    const querySql = 'UPDATE promo_provider SET isActive=0 WHERE endDate < now() AND provider != "indosat"';

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
app.get('/rate', async(req, res) => {
    const queryViapulsaYesterday = 'SELECT * FROM rate WHERE company = "VIA PULSA" AND DATE(createdAt) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)) ORDER BY createdAt DESC LIMIT 1';
    const queryViapulsaToday = 'SELECT * FROM rate WHERE company = "VIA PULSA" ORDER BY createdAt DESC LIMIT 1';

    const queryBypulsaYesterday = 'SELECT * FROM rate WHERE company = "BY PULSA" AND DATE(createdAt) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)) ORDER BY createdAt DESC LIMIT 1';
    const queryBypulsaToday = 'SELECT * FROM rate WHERE company = "BY PULSA" ORDER BY createdAt DESC LIMIT 1';
    
    koneksi.query(queryViapulsaYesterday, (err, rowsViaPulsaYesterday, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
        koneksi.query(queryViapulsaToday, (err, rowsViaPulsaToday, field) => {
            if (err) {
                return res.status(500).json({ message: 'Ada kesalahan', error: err });
            }
            koneksi.query(queryBypulsaYesterday, (err, rowsByPulsaYesterday, fieldYesterday) => {
                if (err) {
                  return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }
              
                koneksi.query(queryBypulsaToday, (err, rowsByPulsaToday, fieldToday) => {
                  if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                  }
                  const viapulsaYesterday = rowsViaPulsaYesterday.map(row => ({
                    ...row,
                    company: row.company,
                    rate: JSON.parse(row.rate),
                    createdAt: new Date(row.createdAt).toLocaleDateString()
                  }));
              
                  const viapulsaToday = rowsViaPulsaToday.map(row => ({
                    ...row,
                    company: row.company,
                    rate: JSON.parse(row.rate),
                    createdAt: new Date(row.createdAt).toLocaleDateString()
                  }));
              
                  const bypulsaYesterday = rowsByPulsaYesterday.map(row => ({
                    ...row,
                    company: row.company,
                    rate: JSON.parse(row.rate),
                    createdAt: new Date(row.createdAt).toLocaleDateString()
                  }));
              
                  const bypulsaToday = rowsByPulsaToday.map(row => ({
                    ...row,
                    company: row.company,
                    rate: JSON.parse(row.rate),
                    createdAt: new Date(row.createdAt).toLocaleDateString()
                  }));
                  const viapulsaYesterdayObj = {};
                  viapulsaYesterday.forEach(obj => {
                    obj.rate.forEach(rateObj => {
                      const provider = Object.keys(rateObj)[0];
                      const rate = rateObj[provider];
                      viapulsaYesterdayObj[provider] = rate;
                    });
                  });
                  const bypulsaYesterdayObj = {};
                  bypulsaYesterday.forEach(obj => {
                    obj.rate.forEach(rateObj => {
                      const provider = Object.keys(rateObj)[0];
                      const rate = rateObj[provider];
                      bypulsaYesterdayObj[provider] = rate;
                    });
                  });
                  const comp = {
                    viapulsa: viapulsaToday.map(obj => {
                      const rates = [];
                      obj.rate.forEach(rateObj => {
                        const provider = Object.keys(rateObj)[0];
                        const rateToday = parseFloat(rateObj[provider]);
                        const rateYesterday = parseFloat(viapulsaYesterdayObj[provider]);
                        const difference = parseFloat((rateToday - rateYesterday).toFixed(2))
                        let status = 'same';
                        if (rateToday > rateYesterday) {
                          status = 'up';
                        } else if (rateToday < rateYesterday) {
                          status = 'down';
                        }
                        rates.push({
                          provider,
                          rateToday,
                          rateYesterday,
                          status,
                          difference
                        });
                      });
                      return {
                        company: obj.company,
                        rates
                      };
                    }),
                    bypulsa: bypulsaToday.map(obj => {
                      const rates = [];
                      obj.rate.forEach(rateObj => {
                        const provider = Object.keys(rateObj)[0];
                        const rateToday = parseFloat(rateObj[provider]);
                        const rateYesterday = parseFloat(bypulsaYesterdayObj[provider]);
                        const difference = parseFloat((rateToday - rateYesterday).toFixed(2))
                        let status = 'same';
                        if (rateToday > rateYesterday) {
                          status = 'up';
                        } else if (rateToday < rateYesterday) {
                          status = 'down';
                        }
                        rates.push({
                          provider,
                          rateToday,
                          rateYesterday,
                          status,
                          difference
                        });
                      });
                      return {
                        company: obj.company,
                        rates
                      };
                    })
                  };
                  const data = [
                    ...comp.viapulsa.map(obj => ({
                        company: obj.company,
                        rates: obj.rates
                    })),
                    ...comp.bypulsa.map(obj => ({
                        company: obj.company,
                        rates: obj.rates
                    }))
                ];
                  
                  res.status(200).json({ success: true, data });
                });
              });
        });
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