const express = require('express');

const router = express.Router()

let SignupController = require('./signup/signup.controller');

router
    .post('/signup', SignupController)

module.exports = router;