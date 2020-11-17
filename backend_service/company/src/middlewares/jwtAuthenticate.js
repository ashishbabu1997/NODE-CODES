"use strict";
exports.__esModule = true;
exports.jwtAuth = void 0;
var passport = require("passport");
exports.jwtAuth = passport.authenticate('jwt', { session: false });
