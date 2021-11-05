import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as dotenv from 'dotenv';
import config from '../config/config';




// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>>Functin to send a transactional welcome email to a signed-up freelancer
export const customWelcomeMail = async (_body) => {
    try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.SIBAPIKEY;
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

        sendSmtpEmail = {

          'sender':config.sendinblueConfigurations.sendinblueSender,
          'to': [
            {
              'email': _body.email,
              'name': _body.name,
            },

          ],
          'templateId': config.sendinblueConfigurations.welcomeMailTemplateId,
          'params': {
            'name': _body.name,
          },

        };
        console.log(sendSmtpEmail)

        await apiInstance.sendTransacEmail(sendSmtpEmail);
  
    } catch (e) {
      console.log('error : ', e.message);
      throw new Error('Failed to send mail');
    }
  };


   // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> ADD RESOURCE TO SENDIBBLUE ALL RESOURCES LIST
export const sendinblueAddResources = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        console.log(_body)
        const apiKey = defaultClient.authentications['api-key'];
        // eslint-disable-next-line no-undef
        apiKey.apiKey = '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';        
        const apiInstance = new SibApiV3Sdk.ContactsApi();
            const createContact = new SibApiV3Sdk.CreateContact();
            createContact.email = _body.email;
            createContact.attributes = { FIRSTNAME: _body.firstName, LASTNAME: _body.lastName, SMS: _body.telephoneNumber };
            createContact.listIds = [_body.listId];
            await apiInstance.createContact(createContact)
        resolve({ code: 200, message: 'Added successfully', data: {} });
      } catch (e) {
        console.log(e);
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};
