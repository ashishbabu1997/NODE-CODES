"use strict";
exports.__esModule = true;
var config_1 = require("./config/config");
var companyProfile_router_1 = require("./profile/companyProfile.router");
var express = require("express");
var router = express.Router();
router
    // .use(`/api/${AppConfig.version}/company/locations`, locationRouter)
    // .use(`/api/${AppConfig.version}/company/services`, serviceRouter)
    // .use(`/api/${AppConfig.version}/company/certifications`, certificationRouter)
    .use("/api/" + config_1["default"].version + "/company/companyProfile", companyProfile_router_1["default"]);
// .use(`/api/${AppConfig.version}/company/employee`, employeeRouter);
exports["default"] = router;
