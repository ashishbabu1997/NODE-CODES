import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import * as emailClient from '../emailManager/emailManager';
import config from '../config/config';
import { createNotification } from '../common/notifications/notifications';
import * as utils from '../utils/utils';

export const submitFreelancerProfileEmail = async (_body, client) => {
  try {
    await client.query('BEGIN');
    const ellowAdmins = await client.query(queryService.getEllowAdmins());
    const result = await client.query(queryService.candidateStatusUpdate(_body));
    await client.query('COMMIT');
    const firstName = result.rows[0].candidate_first_name;
    const lastName = result.rows[0].candidate_last_name;
    const replacements = {
      fName: firstName,
      lName: lastName,
    };
    const path = 'src/emailTemplates/freelancerSubmitText.html';
    const imageResults = await client.query(queryService.getCandidateMailDetails(_body));
    await client.query('COMMIT');
    const message = `${firstName + ' ' + lastName} has submitted his profile for review`;
    await createNotification({
      positionId: null,
      jobReceivedId: null,
      companyId: _body.companyId,
      message: message,
      candidateId: _body.candidateId,
      notificationType: 'freelancer',
      userRoleId: _body.userRoleId,
      employeeId: _body.employeeId,
      image: imageResults.rows[0].image,
      firstName: imageResults.rows[0].candidate_first_name,
      lastName: imageResults.rows[0].candidate_last_name,
    });
    if (Array.isArray(ellowAdmins.rows)) {
      ellowAdmins.rows.forEach((element) => {
        if (utils.notNull(element.email)) {
          emailClient.emailManagerForNoReply(element.email, config.text.submitProfileSubject, path, replacements);
        }
      });
    }
  } catch (e) {
    console.log('error : ', e.message);
    throw new Error('Failed to send mail');
  }
};
