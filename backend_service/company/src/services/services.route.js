"use strict";
exports.__esModule = true;
var services_controller_1 = require("./services.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var addServicesSchema_1 = require("./schemas/addServicesSchema");
var router = express.Router();
router
    .get('/:companyId', services_controller_1.getServices)
    .post('/', joiVaildation_1["default"](addServicesSchema_1["default"]), services_controller_1.addServices);
exports["default"] = router;
