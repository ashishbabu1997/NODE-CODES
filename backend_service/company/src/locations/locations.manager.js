"use strict";
exports.__esModule = true;
exports.deleteCompanyLocations = exports.updateCompanyLocations = exports.createCompanyLocations = exports.fetchCompanyLocations = void 0;
var locations_query_1 = require("./query/locations.query");
var database_1 = require("../common/database/database");
exports.fetchCompanyLocations = function (_body) {
    return new Promise(function (resolve, reject) {
        var query = {
            name: 'fetch-company-locations',
            text: locations_query_1["default"].getCompanyLocations,
            values: [parseInt(_body.companyId)]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Locations listed successfully", data: { locations: results.rows } });
        });
    });
};
exports.createCompanyLocations = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'add-company-locations',
            text: locations_query_1["default"].addCompanyLocations,
            values: [_body.companyId, _body.companyAddress, _body.countryId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Location added successfully", data: {} });
        });
    });
};
exports.updateCompanyLocations = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'update-company-locations',
            text: locations_query_1["default"].updateCompanyLocations,
            values: [_body.companyAddress, _body.countryId, _body.locationId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Location updated successfully", data: {} });
        });
    });
};
exports.deleteCompanyLocations = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'delete-company-locations',
            text: locations_query_1["default"].deleteCompanyLocations,
            values: [_body.locationId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Location deleted successfully", data: {} });
        });
    });
};
