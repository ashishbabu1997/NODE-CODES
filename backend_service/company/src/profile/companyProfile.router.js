"use strict";
exports.__esModule = true;
var companyProfile_controller_1 = require("./companyProfile.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var updateDetailsSchema_1 = require("./schemas/updateDetailsSchema");
var jwtAuthenticate_1 = require("../middlewares/jwtAuthenticate");
var setData_1 = require("../middlewares/setData");
var router = express.Router();
router
    .get('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), companyProfile_controller_1.getDetails)
    .put('/updateCompanyProfile', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](updateDetailsSchema_1["default"]), companyProfile_controller_1.updateDetails);
exports["default"] = router;
