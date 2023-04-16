// const {db} = require("../serverFirebase")
// const promoModel = require('../models/promo')

// const getAllPromo = async (req, res, next) => {
// 	try{
//         const response = await ref.get()
//         let responseArr = []
//         console.log(ref)
//         response.forEach(doc => {
//           responseArr.push(doc.data())
//         })
//         res.send(responseArr)
//       }catch(error){
//         res.send(error)
//       }
// }

// const addPromo = async (req, res) => {
// 	//post firebase
//     // const data = req.body;
//     // ref.add(data)

//     //post mongodb
//     const myData = new MyModel(req.body);
//     myData.save()
    
//       .then(() => {
//         res.send('Data saved successfully');
//       })
//       .catch((err) => {
//         res.status(400).send('Unable to save data');
//       });
// }

// // const getPromo = async (req, res) => {
// // 	try{
// // 		const id = req.params.id
// // 		const promo = await db.collection('promo').doc(id)
// // 		const data = await promo.get()
// // 		if(!data.exists){
// // 			res.status(404).send('User not found')
// // 		}else{
// // 			res.send(data.data())
// // 		}
// // 	}catch(error){
// // 		res.status(400).send(error.message)
// // 	}
// // }

// // const updatepromo = async (req, res) => {
// // 	try{
// // 		const id = req.params.id
// // 		const promo = await db.collection('promo').doc(id)
// // 		const data = req.body
// // 		await promo.update(data)
// // 		res.send('promo updated')
// // 	}catch(error){
// // 		res.status(400).send(error.message)
// // 	}
// // }

// module.exports = {
// 	getAllPromo,
// 	addPromo
// 	// getpromo,
// 	// updatepromo,
// 	// deletepromo
// }