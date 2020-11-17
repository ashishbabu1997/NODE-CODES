"use strict";
exports.__esModule = true;
exports.getPercentage = void 0;
var query_1 = require("./query/query");
var database_1 = require("../common/database/database");
var es6_promise_1 = require("es6-promise");
exports.getPercentage = function (_body) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        var query = {
            name: 'get-percentage',
            text: query_1["default"].getProfilePercentage,
            values: [_body.companyId]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            else {
                resolve({ code: 200, message: "Profile percentage retrieved", data: { profilePercentage: results.rows[0].profilePercentage } });
            }
        });
    });
};
