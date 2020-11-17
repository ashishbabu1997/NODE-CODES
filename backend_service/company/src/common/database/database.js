"use strict";
exports.__esModule = true;
var pg_1 = require("pg");
var dotenv = require("dotenv");
dotenv.config();
exports["default"] = (function () {
    return new pg_1.Pool({
        "user": process.env.USER,
        "host": process.env.HOST,
        "database": process.env.DATABASE,
        "password": process.env.PASSWORD,
        "port": process.env.PORT
    });
});
