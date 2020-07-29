"use strict";
exports.__esModule = true;
exports.createCompanyServices = exports.fetchCompanyServices = void 0;
var services_query_1 = require("./query/services.query");
var database_1 = require("../common/database/database");
exports.fetchCompanyServices = function (_body) {
    return new Promise(function (resolve, reject) {
        var query = {
            name: 'fetch-company-services',
            text: services_query_1["default"].getCompanyServices,
            values: [parseInt(_body.companyId)]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            var rows = results.rows[0];
            var services = rows.services != '' ? rows.services.split(',') : [];
            var domains = rows.domains != '' ? rows.domains.split(',') : [];
            var technologyAreas = rows.technologyareas != '' ? rows.technologyareas.split(',') : [];
            resolve({ code: 200, message: "Services listed successfully", data: { services: services, domains: domains, technologyAreas: technologyAreas } });
        });
    });
};
exports.createCompanyServices = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        database_1["default"]().connect(function (err, client, done) {
            var shouldAbort = function (err) {
                if (err) {
                    console.error('Error in transaction', err.stack);
                    client.query('ROLLBACK', function (err) {
                        if (err) {
                            console.error('Error rolling back client', err.stack);
                            reject({ code: 400, message: "Failed. Please try again.", data: {} });
                            return;
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                    });
                }
                return !!err;
            };
            client.query('BEGIN', function (err) {
                if (shouldAbort(err))
                    return;
                var deleteServicesQuery = {
                    name: 'delete-company-services',
                    text: services_query_1["default"].deleteCompanyServices,
                    values: [_body.companyId, _body.deletedServices]
                };
                client.query(deleteServicesQuery, function (err, res) {
                    if (shouldAbort(err))
                        return;
                    var deleteDomainsQuery = {
                        name: 'delete-company-domains',
                        text: services_query_1["default"].deleteCompanyDomains,
                        values: [_body.companyId, _body.deletedDomains]
                    };
                    client.query(deleteDomainsQuery, function (err, res) {
                        if (shouldAbort(err))
                            return;
                        var deleteTechnologyAreasQuery = {
                            name: 'delete-company-technologyAreas',
                            text: services_query_1["default"].deleteCompanyTechnologyAreas,
                            values: [_body.companyId, _body.deletedTechnologyAreas]
                        };
                        client.query(deleteTechnologyAreasQuery, function (err, res) {
                            if (shouldAbort(err))
                                return;
                            var addServicesQuery = {
                                name: 'create-company-services',
                                text: services_query_1["default"].addCompanyServices,
                                values: [_body.companyId, _body.services, currentTime, currentTime]
                            };
                            client.query(addServicesQuery, function (err, res) {
                                if (shouldAbort(err))
                                    return;
                                var addDomainsQuery = {
                                    name: 'create-company-domains',
                                    text: services_query_1["default"].addCompanyDomains,
                                    values: [_body.companyId, _body.domains, currentTime, currentTime]
                                };
                                client.query(addDomainsQuery, function (err, res) {
                                    if (shouldAbort(err))
                                        return;
                                    var addTechnologiesQuery = {
                                        name: 'create-company-technology',
                                        text: services_query_1["default"].addCompanyTechnologyAreas,
                                        values: [_body.companyId, _body.technologyAreas, currentTime, currentTime]
                                    };
                                    client.query(addTechnologiesQuery, function (err, res) {
                                        if (shouldAbort(err))
                                            return;
                                        var addSupportDocumentQuery = {
                                            name: 'add-support-document',
                                            text: services_query_1["default"].addSupportDocument,
                                            values: [_body.supportingDocument, _body.companyId]
                                        };
                                        client.query(addSupportDocumentQuery, function (err, res) {
                                            if (shouldAbort(err))
                                                return;
                                            client.query('COMMIT', function (err) {
                                                if (err) {
                                                    console.error('Error committing transaction', err.stack);
                                                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                                    return;
                                                }
                                                done();
                                                resolve({ code: 200, message: "Services added successfully", data: {} });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
