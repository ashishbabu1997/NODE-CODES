import {readHTMLFile} from '../middlewares/htmlReader'
import * as handlebars from 'handlebars'
import { sendMail,sendMailForNoReply,sendMultipleMails } from '../middlewares/mailer'


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

export const multipleEmailManager = (mailId,subject,path,replacements) =>
{
    readHTMLFile(path, function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        sendMultipleMails(mailId, subject, htmlToSend, function (err, data) {
            if (err) {
                console.log('Error raised in mail : ',err)
                throw err;
            }
            console.log('Mail sent');
        });
    })
}