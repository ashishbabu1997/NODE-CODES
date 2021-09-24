import { readHTMLFile } from '../middleware/htmlReader';
import * as handlebars from 'handlebars';
import { sendMail, sendCustomerSupportMail } from '../middleware/mailer';

export const emailManager = (mailId, subject, path, replacements) => {
  readHTMLFile(path, function (err, html) {
    var template = handlebars.compile(html);
    var htmlToSend = template(replacements);
    sendMail(mailId, subject, htmlToSend, function (err, data) {
      if (err) {
        console.log('Error raised in mail : ', err);
        throw err;
      }
      console.log('Mail sent');
    });
  });
};
export const emailManagerCustomerSupport = (mailId, subject, path, replacements) => {
  readHTMLFile(path, function (err, html) {
    var template = handlebars.compile(html);
    var htmlToSend = template(replacements);
    sendCustomerSupportMail(mailId, subject, htmlToSend, function (err, data) {
      if (err) {
        console.log('Error raised in mail : ', err);
        throw err;
      }
      console.log('Mail sent');
    });
  });
};
