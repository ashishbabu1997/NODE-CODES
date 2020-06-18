const express = require('express');
const employeeRouter = require('./employee.route');
const AppConfig = require('../config/config.json');
const bodyParser = require('body-parser');

const expressApp = express();

expressApp
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control,Authorization");
        if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
        } else {
            return next();
        }
    });

    expressApp.use(`/${AppConfig.version}/rest/employee`, employeeRouter);


 
let server_http = expressApp.listen(AppConfig.http.port, function () {
    var host = server_http.address().address,
        port = server_http.address().port;
    console.log("===========>>>>>>>>>>>");
    console.log("UserManagement Server listening at http://%s:%s", host, port);
});