"use strict";
exports.__esModule = true;
exports.createEmployee = exports.getEmployeesByCompanyId = void 0;
var employee_query_1 = require("./query/employee.query");
var database_1 = require("../common/database/database");
exports.getEmployeesByCompanyId = function (_body) {
    return new Promise(function (resolve, reject) {
        var selectQuery = employee_query_1["default"].getemployees;
        if (_body.filter) {
            selectQuery = selectQuery + "AND (LOWER(firstname) LIKE '%" + _body.filter.toLowerCase() + "%' OR LOWER(lastname) LIKE '%" + _body.filter.toLowerCase() + "%') ";
        }
        if (_body.sortBy) {
            selectQuery = selectQuery + ' ORDER BY firstname ' + _body.sortBy.toUpperCase();
        }
        if (_body.limit && _body.skip) {
            selectQuery = selectQuery + ' LIMIT ' + _body.limit + ' OFFSET ' + _body.skip;
        }
        var query = {
            name: 'get-EmployeesByCompanyId',
            text: selectQuery,
            values: [parseInt(_body.companyId)]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Employees listed successfully", data: { Employees: results.rows } });
        });
    });
};
exports.createEmployee = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'add-employee',
            text: employee_query_1["default"].addEmploye,
            values: [_body.firstName, _body.lastName, _body.companyId, _body.email, _body.roleId, currentTime, _body.empId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Employee added successfully", data: {} });
        });
    });
};
