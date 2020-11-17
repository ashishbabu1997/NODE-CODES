"use strict";
exports.__esModule = true;
var certifications_controller_1 = require("./certifications.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var addCertificationSchema_1 = require("./schemas/addCertificationSchema");
var updateCertificationSchema_1 = require("./schemas/updateCertificationSchema");
var jwtAuthenticate_1 = require("../middlewares/jwtAuthenticate");
var setData_1 = require("../middlewares/setData");
var router = express.Router();
router
    .get('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), certifications_controller_1.getCertifications)
    .post('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](addCertificationSchema_1["default"]), certifications_controller_1.addCertifications)
    .put('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](updateCertificationSchema_1["default"]), certifications_controller_1.updateCertifications)["delete"]('/:companycertificationId', jwtAuthenticate_1.jwtAuth, setData_1["default"](), certifications_controller_1.deleteCertifications);
exports["default"] = router;
