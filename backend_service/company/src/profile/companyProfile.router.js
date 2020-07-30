"use strict";
exports.__esModule = true;
var companyProfile_controller_1 = require("./companyProfile.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var updateDetailsSchema_1 = require("./schemas/updateDetailsSchema");
var router = express.Router();
router
    .get('/:companyId', companyProfile_controller_1.getDetails)
    .put('/updateCompanyProfile', joiVaildation_1["default"](updateDetailsSchema_1["default"]), companyProfile_controller_1.updateDetails);
exports["default"] = router;
