const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const AppConfig = require('../config/config.json');

const {
    sid: twilioSID,
    token: twilioTOKEN,
    phoneNumber: twilioPhoneNumber
} = AppConfig.twilio;

let expressApp = express();
let TwilioClient = new twilio(twilioSID, twilioTOKEN);

expressApp
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }));

let server_http = expressApp.listen(AppConfig.http.port, function () {
    var host = server_http.address().address,
        port = server_http.address().port;
    console.log("===========>>>>>>>>>>>");
    console.log("VOLTA Message Handler Server listening at http://%s:%s", host, port);
});

expressApp.post('/message/sms/send', function (req, res) {
    const {
        number,
        body
    } = req.body;
    if (!number) return res.status(406).send();
    if (!body) return res.status(406).send();

    TwilioClient.messages.create({
        from: twilioPhoneNumber,
        to: number,
        body: body
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.status(err.status).send({
                "code": err.code,
                "moreInfo": err.moreInfo
            });
            return;
        }
        // console.log('Created message using callback');
        // console.log(result.sid);
        res.status(200).send({
            id: result.sid
        });
    });
});