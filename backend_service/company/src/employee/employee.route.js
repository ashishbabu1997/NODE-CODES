"use strict";
exports.__esModule = true;
var employee_controller_1 = require("./employee.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var addEmployeeSchema_1 = require("./schema/addEmployeeSchema");
var listEmployeeSchema_1 = require("./schema/listEmployeeSchema");
var router = express.Router();
router
    .get('/', joiVaildation_1["default"](listEmployeeSchema_1["default"]), employee_controller_1.getEmployee)
    .post('/', joiVaildation_1["default"](addEmployeeSchema_1["default"]), employee_controller_1.addEmployee);
exports["default"] = router;
