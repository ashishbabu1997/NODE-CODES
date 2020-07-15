"use strict";
exports.__esModule = true;
exports.otp = void 0;
var otpGenerator = require("otp-generator");
exports.otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
