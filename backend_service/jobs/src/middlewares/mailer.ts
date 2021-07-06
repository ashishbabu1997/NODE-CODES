import * as nodemailer from 'nodemailer'
import config from '../config/config';

const transporter = nodemailer.createTransport({
    service:config.mail.service,
    host:"smtp.gmail.com",
    port: 465,
    auth: {
        user: config.noreplymail.user,
        pass: config.noreplymail.password
    }
})
const transporterForNorReply = nodemailer.createTransport({
    service:config.mail.service,
    host:"smtp.gmail.com",
    port: 465,
    auth: {
        user: config.noreplymail.user,
        pass: config.noreplymail.password
    }
})
export const sendMail = (email, subject, html, callback) => {
    const mailOptions = {
        from: `"ellow Alert" <${config.noreplymail.user}>`, 
        to: email, 
        subject,
        html
    };
    
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}
export const sendMailForNoReply = (email, subject, html, callback) => {
    const mailOptions = {
        from: `"ellow Alert" <${config.noreplymail.user}>`, 
        to: email, 
        subject,
        html
    };
    
    transporterForNorReply.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}

export const sendMultipleMails = (email, subject, html, callback) => {
    const mailOptions = {
        from: `"ellow Alert" <${config.noreplymail.user}>`, 
        bcc: email, 
        subject,
        html
    };
    
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}