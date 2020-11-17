"use strict";
exports.__esModule = true;
exports.deleteCompanyLocations = exports.updateCompanyLocations = exports.createCompanyLocations = exports.fetchCompanyLocations = void 0;
var locations_query_1 = require("./query/locations.query");
var database_1 = require("../common/database/database");
var config_1 = require("../config/config");
exports.fetchCompanyLocations = function (_body) {
    return new Promise(function (resolve, reject) {
        var result = {};
        var query = {
            name: 'fetch-company-locations',
            text: locations_query_1["default"].getCompanyLocations,
            values: [_body.companyId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            var _loop_1 = function () {
                var cntryId = results.rows[i].countryId;
                var stId = results.rows[i].stateId;
                var states = config_1["default"].states;
                var countries = config_1["default"].countries;
                var stateResult = states.filter(function (state) { return state.id == stId; });
                var stateName = stateResult[0].name;
                var countryResult = countries.filter(function (country) { return country.id == cntryId; });
                var countryName = countryResult[0].name;
                results.rows[i].country = countryName;
                results.rows[i].state = stateName;
            };
            for (var i = 0; i < results.rowCount; i++) {
                _loop_1();
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
            values: [_body.companyId, _body.streetAddress1, _body.streetAddress2, _body.zipCode, _body.city, _body.stateId, _body.countryId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
        });
        if (_body.gstNumber && _body.panNumber) {
            var taxQuery = {
                name: 'add-gst-pan',
                text: locations_query_1["default"].addTaxDetails,
                values: [_body.companyId, _body.gstNumber, _body.panNumber]
            };
            database_1["default"]().query(taxQuery, function (error, results) {
                if (error) {
                    console.log(error);
                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Locations,PAN Number and GST Number added successfully", data: {} });
            });
        }
        else {
            resolve({ code: 200, message: "Location added successfully", data: {} });
        }
    });
};
exports.updateCompanyLocations = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'update-company-locations',
            text: locations_query_1["default"].updateCompanyLocations,
            values: [_body.streetAddress1, _body.streetAddress2, _body.zipCode, _body.city, _body.stateId, _body.countryId, _body.locationId, _body.companyId]
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
            values: [parseInt(_body.locationId), false]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            console.log(query);
            resolve({ code: 200, message: "Location deleted successfully", data: {} });
        });
    });
};
