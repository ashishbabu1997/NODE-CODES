"use strict";
exports.__esModule = true;
var passport = require("passport");
var passport_jwt_1 = require("passport-jwt");
var config_1 = require("./config");
var opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: config_1["default"].jwtSecretKey
};
exports["default"] = (function () {
    passport.use(new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload, "asdsf");
        return done(null, jwt_payload);
    }));
});
