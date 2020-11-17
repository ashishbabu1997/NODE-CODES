"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getUserDetails = exports.updateUser = exports.createEmployee = exports.getEmployeesByCompanyId = void 0;
var employee_query_1 = require("./query/employee.query");
var database_1 = require("../common/database/database");
exports.getEmployeesByCompanyId = function (_body) {
    return new Promise(function (resolve, reject) {
        var selectQuery = employee_query_1["default"].getemployees;
        if (_body.filter) {
            selectQuery = selectQuery + "AND (LOWER(firstname) LIKE '%" + _body.filter.toLowerCase() + "%' OR LOWER(lastname) LIKE '%" + _body.filter.toLowerCase() + "%') ";
        }
        var orderBy = {
            "firstName": 'first_name',
            "lastName": 'last_name',
            "roleId": 'role_id',
            "email": 'email',
            "createdOn": 'created_on'
        };
        if (_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy)) {
            selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType;
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
            values: [_body.firstName, _body.lastName, _body.companyId, _body.email, _body.roleId, currentTime, _body.contactNumber, true, _body.document, 3]
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
exports.updateUser = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, employeeUpdate, employeeDelete, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]().connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, 11, 12]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        if (!(_body.decisionValue == 1)) return [3 /*break*/, 5];
                        employeeUpdate = {
                            name: 'update-employees',
                            text: employee_query_1["default"].updateEmployee,
                            values: [_body.empId, _body.firstName, _body.lastName, _body.roleId, _body.phoneNumber]
                        };
                        return [4 /*yield*/, client.query(employeeUpdate)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        employeeDelete = {
                            name: 'list-employees',
                            text: employee_query_1["default"].deleteEmployee,
                            values: [_body.empId]
                        };
                        return [4 /*yield*/, client.query(employeeDelete)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [4 /*yield*/, client.query('COMMIT')];
                    case 8:
                        _a.sent();
                        resolve({ code: 200, message: "Employees updated successfully", data: {} });
                        return [3 /*break*/, 12];
                    case 9:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 10:
                        _a.sent();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return [3 /*break*/, 12];
                    case 11:
                        client.release();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        }); })()["catch"](function (e) {
            console.log(e);
            reject({ code: 400, message: "Failed. Please try again.", data: {} });
        });
    });
};
exports.getUserDetails = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, employeeData, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]().connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 9]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        employeeData = {
                            name: 'data-employees',
                            text: employee_query_1["default"].getEmployeeData,
                            values: [_body.empId]
                        };
                        return [4 /*yield*/, client.query(employeeData)];
                    case 4:
                        result = _a.sent();
                        return [4 /*yield*/, client.query('COMMIT')];
                    case 5:
                        _a.sent();
                        resolve({ code: 200, message: "Employees updated successfully", data: { employee: result.rows[0] } });
                        return [3 /*break*/, 9];
                    case 6:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 7:
                        _a.sent();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return [3 /*break*/, 9];
                    case 8:
                        client.release();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); })()["catch"](function (e) {
            console.log(e);
            reject({ code: 400, message: "Failed. Please try again.", data: {} });
        });
    });
};
