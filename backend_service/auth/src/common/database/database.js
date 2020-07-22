"use strict";
exports.__esModule = true;
var pg_1 = require("pg");
var config_1 = require("../../config/config");
exports["default"] = (function () {
    return new pg_1.Pool(config_1["default"].db);
});
