"use strict";
exports.__esModule = true;
exports.getCompanyDetails = void 0;
var query_1 = require("./query/query");
var database_1 = require("../common/database/database");
var config_1 = require("../config/config");
exports.getCompanyDetails = function (_body) {
    return new Promise(function (resolve, reject) {
        var query = {
            name: 'get-personal-profile',
            text: query_1["default"].getProfiles,
            values: [parseInt(_body.companyId)]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            var data = results.rows;
            var result = {};
            if (data.length > 0) {
                var locations_1 = [];
                result = {
                    companyName: data[0].companyName,
                    description: data[0].description,
                    companySize: data[0].companySize,
                    services: data[0].services,
                    skills: data[0].skills,
                    companyLogo: data[0].companyLogo,
                    companyCoverPage: data[0].companyCoverPage,
                    locations: locations_1
                };
                data.forEach(function (element) {
                    locations_1.push({
                        addressLine1: element.addressLine1,
                        addressLine2: element.addressLine2,
                        zipCode: element.zipCode,
                        city: element.city,
                        country: element.countryId !== null ? config_1["default"].countries.find(function (e) { return e.id == element.countryId; }).name : ""
                    });
                });
            }
            resolve({ code: 200, message: "Personal profile listed successfully", data: result });
        });
    });
};
