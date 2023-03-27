var express = require('express');
const staffcontroller = require('../controllers/staffController');
var router = express.Router();

//staff APi's


//Book Appoitnment
router.post('/patient/appoitnment',staffcontroller.bookAppointment) //yes

//Update Appoitnment
router.put('/patient/appoitnment/:appId',staffcontroller.updateAppointment)//yes

//View patient appoitnment history
router.post('/appoitment/list',staffcontroller.viewappointment)//yes

//View patient appoitnment detail
router.get('/patient/appoitnment/:appId',staffcontroller.patientAppointment)

//create bill
router.post('/patient/bill',staffcontroller.createbill)

//View patient bill history
router.get('/bill/list',staffcontroller.BillHistroy)

//View patient bill detail
router.get('/bill/:billId',staffcontroller.BillDetail)

//Update Blll Status
router.post('/bill/:billId',staffcontroller.BillStatus)


module.exports = router;	
		