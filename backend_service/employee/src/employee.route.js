const express = require('express');

const router = express.Router()

let employeeController = require('./employee.controller');

router
    .post('/create', employeeController)

module.exports = router;