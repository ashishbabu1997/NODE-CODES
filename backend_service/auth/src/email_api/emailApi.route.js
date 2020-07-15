"use strict";
exports.__esModule = true;
var express = require("express");
var emailApi_controller_1 = require("./emailApi.controller");
var router = express.Router();
router
    .post('/', emailApi_controller_1.getEmail);
exports["default"] = router;
