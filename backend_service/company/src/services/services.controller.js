"use strict";
exports.__esModule = true;
exports.addServices = exports.getServices = void 0;
var services_manager_1 = require("./services.manager");
var response_1 = require("../common/response/response");
// Fetch services of a company
exports.getServices = function (req, res) {
    var body = req.query;
    services_manager_1.fetchCompanyServices(body).then(function (response) { return response_1["default"](res, response.code, 1, 200, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, 400, error.message, error.data); });
};
// Create/Update services for a company
exports.addServices = function (req, res) {
    var body = req.body;
    services_manager_1.createCompanyServices(body).then(function (response) {
        response_1["default"](res, response.code, 1, 201, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, 401, error.message, error.data);
    });
};
