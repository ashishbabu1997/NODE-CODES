import {readHTMLFile} from '../middlewares/htmlReader'
import * as handlebars from 'handlebars'
import { sendMail } from '../middlewares/mailer'


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