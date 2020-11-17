"use strict";
exports.__esModule = true;
var profilePercentage_controller_1 = require("./profilePercentage.controller");
var express = require("express");
var jwtAuthenticate_1 = require("../middlewares/jwtAuthenticate");
var setData_1 = require("../middlewares/setData");
var router = express.Router();
router
    .get('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), profilePercentage_controller_1.getProfilePercentage);
exports["default"] = router;
