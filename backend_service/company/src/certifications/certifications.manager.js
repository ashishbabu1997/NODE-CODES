"use strict";
exports.__esModule = true;
exports.deleteCompanyCertifications = exports.updateCompanyCertifications = exports.createCompanyCertifications = exports.fetchCompanyCertifications = void 0;
var certification_query_1 = require("./query/certification.query");
var database_1 = require("../common/database/database");
exports.fetchCompanyCertifications = function (_body) {
    return new Promise(function (resolve, reject) {
        var query = {
            name: 'fetch-company-Certifications',
            text: certification_query_1["default"].getCompanyCertifications,
            values: [parseInt(_body.companyId)]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certifications listed successfully", data: { certifications: results.rows } });
        });
    });
};
exports.createCompanyCertifications = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'add-company-certifications',
            text: certification_query_1["default"].addCompanyCertifications,
            values: [_body.companyId, _body.certificateId, _body.certificateNumber, _body.logo, _body.document, currentTime, _body.certificationType]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification added successfully", data: {} });
        });
    });
};
exports.updateCompanyCertifications = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'update-company-certifications',
            text: certification_query_1["default"].updateCompanyCertifications,
            values: [_body.companyId, _body.certificateId, _body.certificateNumber, _body.logo, _body.document, currentTime, _body.certificationType, _body.companyCertificationId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification updated successfully", data: {} });
        });
    });
};
exports.deleteCompanyCertifications = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'delete-company-certification',
            text: certification_query_1["default"].deleteCompanyCertifications,
            values: [currentTime, parseInt(_body.companycertificationId)]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification deleted successfully", data: {} });
        });
    });
};
