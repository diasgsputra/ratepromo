const express = require('express')

const {
    getAllPromo,
	addPromo,
	cekExpiredPromo
} = require('../controller/promoController')

const router = express.Router()
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: false }));
// const path = "/api/v1/database/firestore"

router.get('/promo',getAllPromo)
router.post('/promo',addPromo)
router.get('/cek-expired-promo',cekExpiredPromo)
// router.put(path+'/artikel/:id',updateArtikel)
// router.delete(path+'/artikel/:id',deleteArtikel)
module.exports = router