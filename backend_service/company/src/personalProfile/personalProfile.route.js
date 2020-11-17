"use strict";
exports.__esModule = true;
var personalProfile_controller_1 = require("./personalProfile.controller");
var express = require("express");
var jwtAuthenticate_1 = require("../middlewares/jwtAuthenticate");
var setData_1 = require("../middlewares/setData");
var router = express.Router();
router
    .get('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), personalProfile_controller_1.getProfile);
exports["default"] = router;
