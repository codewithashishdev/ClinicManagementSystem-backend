var express = require('express');
const authentication = require('../middleware/anthentication')
const patientController = require('../controllers/patientController');
var router = express.Router();

//patient APi's


//Dashboard
router.get('/patient/dashboard',patientController.dashboard);

//Book appointment
router.post('/patient/appoitnment',patientController.bookAppointment);

//update appointment
router.put('/patient/appoitnment/:appId',patientController.updateAppointment);

//appointment histroy
router.get('/appoitment/list', patientController.appointmentHistroy);

//view checkup feedback
router.get('/patient/checkup-feedback/:appId',patientController.viewFeedback);

//view appointment bill
router.get('/bill/:billId',patientController.viewBill); 


module.exports = router;