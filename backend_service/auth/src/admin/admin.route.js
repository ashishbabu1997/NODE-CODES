const express = require('express');

const router = express.Router();

let ConsumeruserController = require('./consumeruser/consumeruser.controller');
let SignupController = require('./signup/signup.controller');
let UserController = require('./user/user.controller');
let PolicyController = require('./policy/policy.controller');

router
    .get('/consumeruser/list', ConsumeruserController)
    .post('/user/signup', SignupController)
    .get('/user/list', UserController.list)
    .delete('/user/:userId', UserController.delete)
    .get('/policy', PolicyController.get)
    .put('/policy', PolicyController.put);

module.exports = router;
