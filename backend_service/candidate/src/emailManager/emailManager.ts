import {readHTMLFile} from '../middlewares/htmlReader'
import * as handlebars from 'handlebars'
import { sendMail,sendMailWithAttachments,sendMailForNoReply, sendMailWithDoc,sendMailWithAttachmentsAndCc } from '../middlewares/mailer'


export const emailManager = (mailId,subject,path,replacements) =>
{
    readHTMLFile(path, function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        sendMail(mailId, subject, htmlToSend, function (err, data) {
            if (err) {
                console.log('Error raised in mail : ',err)
                throw err;
            }
            console.log('Mail sent');
        });
    })
}


export const emailManagerWithAttachments = (mailId,subject,path,replacements,attach,cc) =>
{
    readHTMLFile(path, function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        attach.name = replacements.filename;
        sendMailWithAttachments(mailId, subject, htmlToSend,cc,attach, function (err, data) {
            if (err) {
                console.log('Error raised in mail : ',err)
                throw err;
            }
            console.log('Mail sent');
        });
    })
}
export const emailManagerWithAttachmentsAndCc = (mailId,subject,path,replacements,attach,userMail) =>
{
    readHTMLFile(path, function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        attach.name = replacements.filename;
        sendMailWithAttachmentsAndCc(mailId, subject, htmlToSend,attach,userMail, function (err, data) {
            if (err) {
                console.log('Error raised in mail : ',err)
                throw err;
            }
            console.log('Mail sent');
        });
    })
}

export const emailManagerWithDocs = (mailId,subject,path,replacements,attach) =>
{
    readHTMLFile(path, function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        sendMailWithDoc(mailId, subject, htmlToSend,attach, function (err, data) {
            if (err) {
                console.log('Error raised in mail : ',err)
                throw err;
            }
            console.log('Mail sent');
        });
    })
}

export const emailManagerForNoReply = (mailId,subject,path,replacements) =>
{
    readHTMLFile(path, function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        sendMailForNoReply(mailId, subject, htmlToSend, function (err, data) {
            if (err) {
                console.log('Error raised in mail : ',err)
                throw err;
            }
            console.log('Mail sent');
        });
    })
}