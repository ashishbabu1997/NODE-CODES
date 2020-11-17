"use strict";
exports.__esModule = true;
exports.deleteLocations = exports.updateLocations = exports.addLocations = exports.getlocations = void 0;
var locations_manager_1 = require("./locations.manager");
var response_1 = require("../common/response/response");
// Fetch locations of a company
exports.getlocations = function (req, res) {
    var body = req.query;
    console.log(body);
    locations_manager_1.fetchCompanyLocations(body).then(function (response) { return response_1["default"](res, response.code, 1, 200, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, 400, error.message, error.data); });
};
// Create new company locations
exports.addLocations = function (req, res) {
    var body = req.body;
    locations_manager_1.createCompanyLocations(body).then(function (response) {
        response_1["default"](res, response.code, 1, 201, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, 401, error.message, error.data);
    });
};
// Update company locations
exports.updateLocations = function (req, res) {
    var body = req.body;
    locations_manager_1.updateCompanyLocations(body).then(function (response) {
        response_1["default"](res, response.code, 1, 202, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, 402, error.message, error.data);
    });
};
// Delete company locations
exports.deleteLocations = function (req, res) {
    var body = req.params;
    locations_manager_1.deleteCompanyLocations(body).then(function (response) {
        response_1["default"](res, response.code, 1, 203, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, 403, error.message, error.data);
    });
};
