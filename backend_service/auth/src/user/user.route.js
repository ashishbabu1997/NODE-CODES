const express = require('express');

const router = express.Router()

let SignupController = require('./signup/signup.controller');
let LoginController = require('./login/login.controller');
let ProfileController = require('./profile/profile.controller');
let ForgotpasswordController = require('./forgotpassword/forgotpassword.controller');
let ValidateotpController = require('./validateotp/validateotp.controller');
let ResetpasswordController = require('./resetpassword/resetpassword.controller');
let ForgotusernameController = require('./forgotusername/forgotusername.controller');
let LogoutController = require('./logout/logout.controller');

router
    .post('/signup', SignupController)
    .post('/login', LoginController)
    .get('/:userId/profile', ProfileController.get)
    .put('/:userId/profile', ProfileController.put)
    .post('/forgotpassword', ForgotpasswordController)
    .post('/validateotp', ValidateotpController)
    .post('/resetpassword', ResetpasswordController)
    .post('/forgotusername', ForgotusernameController)
    .post('/logout/:token', LogoutController);

module.exports = router;
