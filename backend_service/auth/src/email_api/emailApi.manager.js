"use strict";
exports.__esModule = true;
exports.mailer = exports.addDetails = void 0;
var query_1 = require("./query/query");
var nodemailer_1 = require("nodemailer");
var database_1 = require("../common/database/database");
var get_otp = require("./otp_generator");
var otp = get_otp.otp;
console.log(otp)
exports.addDetails = function (_body) {
    return new Promise(function (resolve, reject) {
        var query = {
            name: 'add-email-otp',
            text: query_1["default"].createUser,
            values: [_body.email, otp]
        };
        console.log("hai")
        database_1["default"]().query(query, function (error, results) {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Email and otp has added to database successfully", data: [_body.email, otp] });
        });
    });
};
// exports.mailer = function (_body) {
//     return new Promise(function (resolve, reject) {
//         var transporter = nodemailer_1["default"].createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'yourmail@gmail.com',
//                 pass: 'password'
//             }
//         });
//         var mailOptions = {
//             from: 'yourmail@gmail.com',
//             to: [_body.email],
//             subject: 'Your Ellow.AI otp is here',
//             text: otp
//         };
//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.log(error);
//             }
//             else {
//                 console.log('OTP has send successfully: ' + info.response);
//             }
//         });
//     });
// };
