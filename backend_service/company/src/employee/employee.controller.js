"use strict";
exports.__esModule = true;
exports.getemployeeData = exports.updateEmployee = exports.addEmployee = exports.getEmployee = void 0;
var employee_manager_1 = require("./employee.manager");
var response_1 = require("../common/response/response");
exports.getEmployee = function (req, res) {
    var body = req.query;
    employee_manager_1.getEmployeesByCompanyId(body).then(function (response) { return response_1["default"](res, response.code, 1, 200, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, 400, error.message, error.data); });
};
exports.addEmployee = function (req, res) {
    var body = req.body;
    employee_manager_1.createEmployee(body).then(function (response) {
        response_1["default"](res, response.code, 1, 201, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, 401, error.message, error.data);
    });
};
exports.updateEmployee = function (req, res) {
    var body = req.body;
    employee_manager_1.updateUser(body).then(function (response) { return response_1["default"](res, response.code, 1, 200, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, 400, error.message, error.data); });
};
exports.getemployeeData = function (req, res) {
    var body = req.query;
    employee_manager_1.getUserDetails(body).then(function (response) { return response_1["default"](res, response.code, 1, 200, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, 400, error.message, error.data); });
};
