var express = require('express');
var router = express.Router();
const autoController = require('../controllers/authController')
const authentication = require('../middleware/anthentication')

//ligin APi's


//sign up
router.post('/user/sign-up',autoController.signup)

//login
router.post('/user/login',autoController.login)

//change-password
router.post('/user/change-password',authentication.Authentication,autoController.changePassword)

//forgot-password
router.post('/user/forgot-password',autoController.forgotPassword)
//send otp
//get user
//update user edit profile
//email verify  otp verify
//logout && sign out

module.exports = router;

