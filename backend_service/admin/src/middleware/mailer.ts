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
export const sendMail = (email, subject, html, callback) => {
    const mailOptions = {
        from: config.mail.user, 
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
