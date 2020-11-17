"use strict";
exports.__esModule = true;
var locations_controller_1 = require("./locations.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var addLocationSchema_1 = require("./schemas/addLocationSchema");
var updateLocationSchema_1 = require("./schemas/updateLocationSchema");
var jwtAuthenticate_1 = require("../middlewares/jwtAuthenticate");
var setData_1 = require("../middlewares/setData");
var router = express.Router();
router
    .get('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), locations_controller_1.getlocations)
    .post('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](addLocationSchema_1["default"]), locations_controller_1.addLocations)
    .put('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](updateLocationSchema_1["default"]), locations_controller_1.updateLocations)
    .get('/:locationId', locations_controller_1.deleteLocations);
exports["default"] = router;
