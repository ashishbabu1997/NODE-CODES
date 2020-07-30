"use strict";
exports.__esModule = true;
exports.deleteCertifications = exports.updateCertifications = exports.addCertifications = exports.getCertifications = void 0;
var certifications_manager_1 = require("./certifications.manager");
var response_1 = require("../common/response/response");
exports.getCertifications = function (req, res) {
    var body = req.params;
    certifications_manager_1.fetchCompanyCertifications(body).then(function (response) { return response_1["default"](res, response.code, 1, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, error.message, error.data); });
};
exports.addCertifications = function (req, res) {
    var body = req.body;
    certifications_manager_1.createCompanyCertifications(body).then(function (response) {
        response_1["default"](res, response.code, 1, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, error.message, error.data);
    });
};
exports.updateCertifications = function (req, res) {
    var body = req.body;
    certifications_manager_1.updateCompanyCertifications(body).then(function (response) {
        response_1["default"](res, response.code, 1, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, error.message, error.data);
    });
};
exports.deleteCertifications = function (req, res) {
    var body = req.params;
    certifications_manager_1.deleteCompanyCertifications(body).then(function (response) {
        response_1["default"](res, response.code, 1, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, error.message, error.data);
    });
};
