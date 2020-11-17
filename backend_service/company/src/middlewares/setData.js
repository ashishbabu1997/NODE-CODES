"use strict";
exports.__esModule = true;
exports["default"] = (function () {
    return function (req, res, next) {
        console.log(req.user.companyId);
        if (req.user.hasOwnProperty('companyId')) {
            if (req.route.methods.hasOwnProperty("post") || req.route.methods.hasOwnProperty("put")) {
                req.body['companyId'] = req.user.companyId;
                req.body['employeeId'] = req.user.employeeId;
                req.body['userRoleId'] = req.user.userRoleId;
            }
            else if (req.route.methods.hasOwnProperty("get") || req.route.methods.hasOwnProperty("delete")) {
                req.query['companyId'] = req.user.companyId;
                req.query['employeeId'] = req.user.employeeId;
                req.query['userRoleId'] = req.user.userRoleId;
            }
        }
        next();
    };
});
