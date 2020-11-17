"use strict";
exports.__esModule = true;
var services_controller_1 = require("./services.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var addServicesSchema_1 = require("./schemas/addServicesSchema");
var jwtAuthenticate_1 = require("../middlewares/jwtAuthenticate");
var setData_1 = require("../middlewares/setData");
var router = express.Router();
router
    .get('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), services_controller_1.getServices)
    .post('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](addServicesSchema_1["default"]), services_controller_1.addServices);
exports["default"] = router;
