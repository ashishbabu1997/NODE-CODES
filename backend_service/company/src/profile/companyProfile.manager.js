"use strict";
exports.__esModule = true;
exports.update_Details = exports.get_Details = void 0;
var query_1 = require("./query/query");
var database_1 = require("../common/database/database");
exports.get_Details = function (_body) {
    return new Promise(function (resolve, reject) {
        var query = {
            name: 'get_details',
            text: query_1["default"].get_details,
            values: [_body.company_id]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                console.log(query);
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            resolve(results.rows[0].company_id);
        });
    });
};
exports.update_Details = function (_body) {
    return new Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'update_details',
            text: query_1["default"].update_details,
            values: [_body.companyId, _body.profileUrl, _body.description, _body.logo, _body.coverPage, _body.tagline, _body.facebookId, _body.instagramId,
                _body.twitterId, _body.linkedinId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed to update profile. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile updated successfully", data: {} });
        });
    });
};
