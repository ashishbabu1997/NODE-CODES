import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as dotenv from 'dotenv';
import config from '../config/config';
dotenv.config()



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

        await apiInstance.sendTransacEmail(sendSmtpEmail);
  
    } catch (e) {
      console.log('error : ', e.message);
      throw new Error('Failed to send mail');
    }
  };