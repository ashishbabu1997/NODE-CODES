"use strict";
exports.__esModule = true;
var locations_controller_1 = require("./locations.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var addLocationSchema_1 = require("./schemas/addLocationSchema");
var updateLocationSchema_1 = require("./schemas/updateLocationSchema");
var router = express.Router();
router
    .get('/:companyId', locations_controller_1.getlocations)
    .post('/', joiVaildation_1["default"](addLocationSchema_1["default"]), locations_controller_1.addLocations)
    .put('/', joiVaildation_1["default"](updateLocationSchema_1["default"]), locations_controller_1.updateLocations)["delete"]('/:locationId', locations_controller_1.deleteLocations);
exports["default"] = router;
