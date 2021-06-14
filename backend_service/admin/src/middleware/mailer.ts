import * as nodemailer from 'nodemailer'
import config from '../config/config';

const transporter = nodemailer.createTransport({
    service:config.mail.service,
    host:"smtp.gmail.com",
    port: 465,
    auth: {
        user: config.mail.user,
        pass: config.mail.password
    }
})
const transporterCustomerSupport = nodemailer.createTransport({
    service:config.mail.service,
    host:"smtp.gmail.com",
    port: 465,
    auth: {
        user: config.csmail.user,
        pass: config.csmail.password
    }
})
export const sendMail = (email, subject, html, callback) => {
    const mailOptions = {
        from: `"No Reply" <${config.mail.user}>`, 
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

export const sendCustomerSupportMail = (email, subject, html, callback) => {
    const mailOptions = {
        from:`"ellow Customer Support" <${config.csmail.user}>`, 
        to: email, 
        subject,
        html
    };
    
    transporterCustomerSupport.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}
