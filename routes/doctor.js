var express = require('express');
const doctorController= require('../controllers/doctorController');
var router = express.Router();

//doctor APi's


//Add checkup feedback
router.post('/doctor/checkup-feedback',doctorController.addFeedback);

//Update checkup feedback
router.put('/doctor/checkup-feedback/:feedBackID',doctorController.updateFeedback);

//Appoitnment list with filters
router.post('/appoitment/list',doctorController.appointmentList);


module.exports = router;