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
exports.createCompanyServices = exports.fetchCompanyServices = void 0;
var services_query_1 = require("./query/services.query");
var database_1 = require("../common/database/database");
exports.fetchCompanyServices = function (_body) {
    return new Promise(function (resolve, reject) {
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
                var getCompanyServicesQuery = {
                    name: 'get-company-services',
                    text: services_query_1["default"].getCompanyServices,
                    values: [_body.companyId]
                };
                client.query(getCompanyServicesQuery, function (err, servicesResponse) {
                    if (shouldAbort(err))
                        return;
                    var services = servicesResponse.rows;
                    var getCompanyDomainsQuery = {
                        name: 'get-company-domains',
                        text: services_query_1["default"].getCompanyDomains,
                        values: [_body.companyId]
                    };
                    client.query(getCompanyDomainsQuery, function (err, domainsResponse) {
                        if (shouldAbort(err))
                            return;
                        var domains = domainsResponse.rows;
                        var getCompanyTechnologyAreasQuery = {
                            name: 'get-company-technologyAreas',
                            text: services_query_1["default"].getCompanyTechnologyAreas,
                            values: [_body.companyId]
                        };
                        client.query(getCompanyTechnologyAreasQuery, function (err, technologyResponse) {
                            if (shouldAbort(err))
                                return;
                            var technologyAreas = technologyResponse.rows;
                            var getSupportingDocumentQuery = {
                                name: 'get-company-supporting-document',
                                text: services_query_1["default"].getSupportingDocument,
                                values: [_body.companyId]
                            };
                            client.query(getSupportingDocumentQuery, function (err, res) {
                                if (shouldAbort(err))
                                    return;
                                var supportingDocument = res.rows.length > 0 ? res.rows[0].supportingDocument : null;
                                client.query('COMMIT', function (err) {
                                    if (err) {
                                        console.error('Error committing transaction', err.stack);
                                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                        return;
                                    }
                                    done();
                                    resolve({ code: 200, message: "Services listed successfully", data: { supportingDocument: supportingDocument, services: services, domains: domains, technologyAreas: technologyAreas } });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
exports.createCompanyServices = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, getCompanyServicesOldQuery, previousData, response, servicesOld, domainsOld, technologyAreasOld, services_1, domains_1, technologyAreas_1, deletedServices, deletedDomains, deletedTechnologyAreas, deleteServicesQuery, deleteDomainsQuery, deleteTechnologyAreasQuery, addServicesQuery, addDomainsQuery, addTechnologiesQuery, addSupportDocumentQuery, getprofilePercentge, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]().connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 14, 16, 17]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        getCompanyServicesOldQuery = {
                            name: 'get-company-services-old',
                            text: services_query_1["default"].getCompanyServicesOld,
                            values: [_body.companyId]
                        };
                        return [4 /*yield*/, client.query(getCompanyServicesOldQuery)];
                    case 4:
                        previousData = _a.sent();
                        if (!(previousData.rows.length > 0)) return [3 /*break*/, 8];
                        response = previousData.rows[0];
                        servicesOld = response.services;
                        domainsOld = response.domains;
                        technologyAreasOld = response.technologyAreas;
                        services_1 = _body.services;
                        domains_1 = _body.domains;
                        technologyAreas_1 = _body.technologyAreas;
                        deletedServices = servicesOld.filter(function (e) { return services_1.indexOf(e) == -1; });
                        deletedDomains = domainsOld.filter(function (e) { return domains_1.indexOf(e) == -1; });
                        deletedTechnologyAreas = technologyAreasOld.filter(function (e) { return technologyAreas_1.indexOf(e) == -1; });
                        deleteServicesQuery = {
                            name: 'delete-company-services',
                            text: services_query_1["default"].deleteCompanyServices,
                            values: [_body.companyId, deletedServices]
                        };
                        return [4 /*yield*/, client.query(deleteServicesQuery)];
                    case 5:
                        _a.sent();
                        deleteDomainsQuery = {
                            name: 'delete-company-domains',
                            text: services_query_1["default"].deleteCompanyDomains,
                            values: [_body.companyId, deletedDomains]
                        };
                        return [4 /*yield*/, client.query(deleteDomainsQuery)];
                    case 6:
                        _a.sent();
                        deleteTechnologyAreasQuery = {
                            name: 'delete-company-technologyAreas',
                            text: services_query_1["default"].deleteCompanyTechnologyAreas,
                            values: [_body.companyId, deletedTechnologyAreas]
                        };
                        return [4 /*yield*/, client.query(deleteTechnologyAreasQuery)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        addServicesQuery = {
                            name: 'create-company-services',
                            text: services_query_1["default"].addCompanyServices,
                            values: [_body.companyId, _body.services, currentTime, currentTime]
                        };
                        return [4 /*yield*/, client.query(addServicesQuery)];
                    case 9:
                        _a.sent();
                        addDomainsQuery = {
                            name: 'create-company-domains',
                            text: services_query_1["default"].addCompanyDomains,
                            values: [_body.companyId, _body.domains, currentTime, currentTime]
                        };
                        return [4 /*yield*/, client.query(addDomainsQuery)];
                    case 10:
                        _a.sent();
                        addTechnologiesQuery = {
                            name: 'create-company-technology',
                            text: services_query_1["default"].addCompanyTechnologyAreas,
                            values: [_body.companyId, _body.technologyAreas, currentTime, currentTime]
                        };
                        return [4 /*yield*/, client.query(addTechnologiesQuery)];
                    case 11:
                        _a.sent();
                        addSupportDocumentQuery = {
                            name: 'add-support-document',
                            text: services_query_1["default"].addSupportDocument,
                            values: [_body.supportingDocument, _body.companyId]
                        };
                        return [4 /*yield*/, client.query(addSupportDocumentQuery)];
                    case 12:
                        _a.sent();
                        getprofilePercentge = {
                            name: 'get-profile-percentge',
                            text: services_query_1["default"].getProfilePercentage,
                            values: [_body.companyId]
                        };
                        database_1["default"]().query(getprofilePercentge, function (error, results) {
                            if (error) {
                                reject({ code: 400, message: "Failed to fetch profile percentage", data: {} });
                                return;
                            }
                            else {
                                var profilePercentage = results.rows[0].profilePercentage;
                                if (_body.supportingDocument == '') {
                                    var count = profilePercentage + 20;
                                }
                                else {
                                    var count = profilePercentage + 25;
                                }
                            }
                            var updateProfile = {
                                name: 'profile-percentage-update',
                                text: services_query_1["default"].updateProfilePercentage,
                                values: [count, _body.companyId]
                            };
                            database_1["default"]().query(updateProfile, function (error, results) {
                                if (error) {
                                    reject({ code: 400, message: "Failed to update profile percentage", data: {} });
                                    return;
                                }
                            });
                        });
                        return [4 /*yield*/, client.query('COMMIT')];
                    case 13:
                        _a.sent();
                        resolve({ code: 200, message: "Services added successfully", data: {} });
                        return [3 /*break*/, 17];
                    case 14:
                        e_1 = _a.sent();
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 15:
                        _a.sent();
                        console.log(e_1);
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return [3 /*break*/, 17];
                    case 16:
                        client.release();
                        return [7 /*endfinally*/];
                    case 17: return [2 /*return*/];
                }
            });
        }); })()["catch"](function (e) {
            console.log(e);
            reject({ code: 400, message: "Failed. Please try again.", data: {} });
        });
    });
};
