"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var config_1 = require("./config/config");
var company_router_1 = require("./company.router");
var passportJwtConfig_1 = require("./config/passportJwtConfig");
var app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true
}));
passportJwtConfig_1["default"]();
app.use('/', company_router_1["default"]);
app.listen(config_1["default"].http.port, function () {
    console.log('Listening on port ' + config_1["default"].http.port);
});
