"use strict";
exports.__esModule = true;
var config_1 = require("./config/config");
var emailApi_route_1 = require("./email_api/emailApi.route");
var express = require("express");
var router = express.Router();
router
    .use("/api/" + config_1["default"].version + "/email_signup", emailApi_route_1["default"]);
exports["default"] = router;
