import * as nodemailer from 'nodemailer'
import config from '../config/config';
import * as dotenv from "dotenv";
import * as util from '../utils/utils';

let user='',pass='',recepient='';
dotenv.config();

const transporter = nodemailer.createTransport({
    service:config.mail.service,
    auth: {
        user: config.noreplymail.user,
        pass: config.noreplymail.password
    }
   
})
const transporterNoReply = nodemailer.createTransport({
    service:config.noreplymail.service,
    auth: {
        user: config.noreplymail.user,
        pass: config.noreplymail.password
    }
   
})

const getTransporter = (user,pass) => {
    return nodemailer.createTransport({
        service:config.mail.service,
        auth: {
            user: user,
            pass: pass
        }
       
    })
}




export const sendMail = (email, subject, html, callback) => {
    const mailOptions = {
        from: `"ellow Alert" <${config.noreplymail.user}>`, 
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
export const sendMailWithAttachments = (email, subject, html,cc,attach, callback) => {
    const mailOptions = {
        from: `"ellow Alert" <${config.noreplymail.user}>`, 
        to: email, 
        cc:cc,
        subject:subject,
        html:html,
        attachments:{
            filename: attach.name,
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
export const sendMailWithAttachmentsAndCc = (email,cc,bcc, subject, html,attach,userMail, callback) => {
    let userDetails = util.reccuiterMailCheck(userMail);
    const {user,recipient,pass} = userDetails;
    const transpotterCc = getTransporter(user,pass);
    
    const mailOptions = {
        from: `"${recipient}" <${user}>`, 
        to: email, 
        cc:cc,
        bcc:bcc,
        subject:subject,
        html:html,
        attachments:{
            filename: attach.name,
            content:attach
        }
    };
 
    transpotterCc.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}
export const sendMailWithAttachmentsOnly = (email, subject, html,attach,userMail, callback) => {
    let userDetails = util.reccuiterMailCheck(userMail);
    const {user,recipient,pass} = userDetails;
    const transpotterCc = getTransporter(user,pass);
    
    const mailOptions = {
        from: `"${recipient}" <${user}>`, 
        to: email, 
        subject:subject,
        html:html,
        attachments:{
            filename: attach.name,
            content:attach
        }
    };
 
    transpotterCc.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}
export const sendMailWithDoc = (email, subject, html,attach, callback) => {
    const mailOptions = {
        from: `"ellow Alert" <${config.noreplymail.user}>`, 
        to: email, 
        subject:subject,
        html:html,
        attachments:{
            filename: 'resume.txt',
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
        from: `"ellow Alert" <${config.noreplymail.user}>`, 
        to: email, 
        subject,
        html,
    };
    
    transporterNoReply.sendMail(mailOptions, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
}