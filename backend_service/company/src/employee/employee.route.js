"use strict";
exports.__esModule = true;
var employee_controller_1 = require("./employee.controller");
var express = require("express");
var joiVaildation_1 = require("../middlewares/joiVaildation");
var addEmployeeSchema_1 = require("./schema/addEmployeeSchema");
var listEmployeeSchema_1 = require("./schema/listEmployeeSchema");
var updateEmployeeSchema_1 = require("./schema/updateEmployeeSchema");
var jwtAuthenticate_1 = require("../middlewares/jwtAuthenticate");
var setData_1 = require("../middlewares/setData");
var router = express.Router();
router
    .get('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](listEmployeeSchema_1["default"]), employee_controller_1.getEmployee)
    .post('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](addEmployeeSchema_1["default"]), employee_controller_1.addEmployee)
    .put('/', jwtAuthenticate_1.jwtAuth, setData_1["default"](), joiVaildation_1["default"](updateEmployeeSchema_1["default"]), employee_controller_1.updateEmployee)
    .get('/userDetails', jwtAuthenticate_1.jwtAuth, setData_1["default"](), employee_controller_1.getemployeeData);
exports["default"] = router;
