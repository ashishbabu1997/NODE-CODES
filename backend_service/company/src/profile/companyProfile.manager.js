"use strict";
exports.__esModule = true;
exports.update_Details = exports.get_Details = void 0;
var query_1 = require("./query/query");
var database_1 = require("../common/database/database");
var es6_promise_1 = require("es6-promise");
exports.get_Details = function (_body) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        var query = {
            name: 'get_details',
            text: query_1["default"].getProfiles,
            values: [_body]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile listed successfully", data: { Profile: results.rows } });
        });
    });
};
exports.update_Details = function (_body) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        var currentTime = Math.floor(Date.now() / 1000);
        var query = {
            name: 'update_details',
            text: query_1["default"].updateProfileDetails,
            values: [_body.profileUrl, _body.description, _body.logo, _body.coverPage, _body.tagline, _body.facebookId, _body.instagramId, _body.twitterId, _body.linkedinId, parseInt(_body.companyId)]
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
