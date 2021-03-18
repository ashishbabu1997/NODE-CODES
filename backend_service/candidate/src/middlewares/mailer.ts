import * as nodemailer from 'nodemailer'
import config from '../config/config';

const transporter = nodemailer.createTransport({
    service:config.mail.service,
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
        html,
    };
    
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}
export const sendMailWithAttachments = (email, subject, html,attach, callback) => {
    const mailOptions = {
        from: config.mail.user, 
        to: email, 
        subject:subject,
        html:html,
        attachments:{
            filename: 'resume.pdf',
            content:attach
        }
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
        from: config.noreplymail.user, 
        to: email, 
        subject,
        html,
    };
    
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}