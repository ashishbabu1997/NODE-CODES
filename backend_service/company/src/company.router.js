"use strict";
exports.__esModule = true;
var config_1 = require("./config/config");
var locations_route_1 = require("./locations/locations.route");
var services_route_1 = require("./services/services.route");
var certifications_route_1 = require("./certifications/certifications.route");
var employee_route_1 = require("./employee/employee.route");
var companyProfile_router_1 = require("./profile/companyProfile.router");
var express = require("express");
var router = express.Router();
router
    .use("/api/" + config_1["default"].version + "/company/locations", locations_route_1["default"])
    .use("/api/" + config_1["default"].version + "/company/services", services_route_1["default"])
    .use("/api/" + config_1["default"].version + "/company/certifications", certifications_route_1["default"])
    .use("/api/" + config_1["default"].version + "/company/companyProfile", companyProfile_router_1["default"])
    .use("/api/" + config_1["default"].version + "/company/employee", employee_route_1["default"]);
exports["default"] = router;
