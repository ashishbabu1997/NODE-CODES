"use strict";
exports.__esModule = true;
exports.sendOtp = void 0;
var query_1 = require("./query/query");
var database_1 = require("../common/database/database");
var otpGenerator = require("otp-generator");
var es6_promise_1 = require("es6-promise");
var mailer_1 = require("../middlewares/mailer");
var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
exports.sendOtp = function (_body) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        var query = {
            name: 'add-email-otp',
            text: query_1["default"].insertEmailOtp,
            values: [_body, otp]
        };
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: [_body, otp] });
                return;
            }
            resolve({ code: 200, message: "Email and otp has added to database successfully" });
            var subject = "Your OTP is";
            mailer_1.sendMail(_body, subject, otp, function (err, data) {
                if (err) {
                    reject({ code: 400, message: "Failed. Please try again.", data: [_body, otp] });
                    return;
                }
                console.log('Email sent!!!');
                resolve({ code: 201, message: "OTP  has sent to your email successfully", data: [_body, otp] });
            });
        });
    });
};
