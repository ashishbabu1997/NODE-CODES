import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import * as emailClient from '../emailManager/emailManager';
import { createNotification } from '../common/notifications/notifications';
import config from '../config/config';

// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for updating hiring step details for an applied candidate
export const updateHiringStepDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        if ([undefined, null, ''].includes(_body.assignedTo)) {
          reject({ code: 400, message: 'There should be assignee for adding hiring steps', data: {} });
        } else {
          const result = await client.query(queryService.updateHiringStepDetailsQuery(_body));
          const candidateClientHiringStepName = result.rows[0].candidate_hiring_step_name;
          _body.candidateId = result.rows[0].candidate_id;
          _body.positionId = result.rows[0].position_id;
          const resourceAllocatedRecruiter = await client.query(queryService.getResourceAllocatedRecruiter(_body));
          const positions = await client.query(queryService.getPositionName(_body));
          const assignee = await client.query(queryService.getAssigneeName(_body));
          const imageResults = await client.query(queryService.getCandidateMailDetails(_body));
          if (candidateClientHiringStepName == 'Negotiation/Close position') {
            await client.query(queryService.updateMakeOfferValue(_body));

            if (_body.hiringAssesmentValue == 0) {
              const message = `${imageResults.rows[0].candidate_first_name + ' ' + imageResults.rows[0].candidate_last_name} has accepted the offer by ${positions.rows[0].company_name}`;
              await createNotification({
                positionId: null,
                jobReceivedId: null,
                companyId: _body.companyId,
                message: message,
                candidateId: _body.candidateId,
                notificationType: 'candidate',
                userRoleId: _body.userRoleId,
                employeeId: _body.employeeId,
                image: imageResults.rows[0].image,
                firstName: imageResults.rows[0].candidate_first_name,
                lastName: imageResults.rows[0].candidate_last_name,
              });
              const subj = 'Resource Acceptance Notification';
              const path = 'src/emailTemplates/resourceAcceptionMailText.html';
              const adminReplacements = {
                fName: imageResults.rows[0].candidate_first_name,
                lName: imageResults.rows[0].candidate_last_name,
                cName: positions.rows[0].company_name,
                pName: positions.rows[0].position_name,
              };

              emailClient.emailManagerForNoReply(resourceAllocatedRecruiter.rows[0].email, subj, path, adminReplacements);

              emailClient.emailManagerForNoReply(positions.rows[0].email, subj, path, adminReplacements);

              const assigneePath = 'src/emailTemplates/resourceAcceptionAssigneeMailText.html';
              const assigneeReplacements = {
                fName: imageResults.rows[0].candidate_first_name,
                lName: imageResults.rows[0].candidate_last_name,
                pName: positions.rows[0].position_name,
              };

              emailClient.emailManagerForNoReply(assignee.rows[0].email, subj, assigneePath, assigneeReplacements);
              await client.query(queryService.updateAvailabilityOfCandidate(_body));
              const updatedResourceCounts = await client.query(queryService.updateClosedCount(_body));
              if (updatedResourceCounts.rows[0].developer_count >= updatedResourceCounts.rows[0].close_count) {
                await client.query(queryService.updateJobStatus(_body));
              }
            } else if (_body.hiringAssesmentValue == 1) {
              const subject = 'Resource Rejection Notification';
              const rejectionPath = 'src/emailTemplates/resourceRejectionMailText.html';
              const rejectionAdminReplacements = {
                fName: imageResults.rows[0].candidate_first_name,
                lName: imageResults.rows[0].candidate_last_name,
                cName: positions.rows[0].company_name,
                pName: positions.rows[0].position_name,
              };

              emailClient.emailManagerForNoReply(resourceAllocatedRecruiter.rows[0].email, subject, rejectionPath, rejectionAdminReplacements);
              emailClient.emailManagerForNoReply(positions.rows[0].email, subject, rejectionPath, rejectionAdminReplacements);
            } else {
              const ellowSubject = 'Ellow Rejection Notification';
              const ellowRejectionAssigneePath = 'src/emailTemplates/ellowRejectionAssigneeMailText.html';
              const ellowRejectionAssigneeReplacements = {
                fName: imageResults.rows[0].candidate_first_name,
                lName: imageResults.rows[0].candidate_last_name,
                pName: positions.rows[0].position_name,
              };
              emailClient.emailManagerForNoReply(assignee.rows[0].email, ellowSubject, ellowRejectionAssigneePath, ellowRejectionAssigneeReplacements);
              emailClient.emailManagerForNoReply(resourceAllocatedRecruiter.rows[0].email, ellowSubject, ellowRejectionAssigneePath, ellowRejectionAssigneeReplacements);
              emailClient.emailManagerForNoReply(positions.rows[0].email, ellowSubject, ellowRejectionAssigneePath, ellowRejectionAssigneeReplacements);
            }
          } else if (candidateClientHiringStepName == 'Discussion with resource') {
            const discussionWithResourceSubject = 'Discussion With Resource Notification';
            const recruitersPath = 'src/emailTemplates/recruitersDiscussionMailText.html';
            const assigneesPath = 'src/emailTemplates/assigneeDisscussionMailText.html';
            const ressourcesPath = 'src/emailTemplates/resourceDiscussionMailText.html';
            const recruitersReplacements = {
              fName: imageResults.rows[0].candidate_first_name,
              cName: positions.rows[0].company_name,
              pName: positions.rows[0].position_name,
            };

            emailClient.emailManagerForNoReply(resourceAllocatedRecruiter.rows[0].email, discussionWithResourceSubject, recruitersPath, recruitersReplacements);
            emailClient.emailManagerForNoReply(positions.rows[0].email, discussionWithResourceSubject, recruitersPath, recruitersReplacements);

            const assigneesReplacements = {
              fName: imageResults.rows[0].candidate_first_name,
              lName: imageResults.rows[0].candidate_last_name,
              aName: assignee.rows[0].firstname,
              pName: positions.rows[0].position_name,
              pcName: positions.rows[0].company_name,
            };

            emailClient.emailManagerForNoReply(assignee.rows[0].email, discussionWithResourceSubject, assigneesPath, assigneesReplacements);

            const resourcesReplacements = {
              fName: imageResults.rows[0].candidate_first_name,
              cName: positions.rows[0].company_name,
              aName: assignee.rows[0].firstname,
              pName: positions.rows[0].position_name,
            };
            emailClient.emailManager(imageResults.rows[0].email_address, discussionWithResourceSubject, ressourcesPath, resourcesReplacements);
          } else {
            const makeOfferSubject = 'Offer of Recruitment';
            const recruiterOfferPath = 'src/emailTemplates/makeOfferMailText.html';
            const recruiterOfferReplacements = {
              fName: imageResults.rows[0].candidate_first_name,
              aName: assignee.rows[0].firstname,
              pName: positions.rows[0].position_name,
              cName: positions.rows[0].company_name,
            };
            if (resourceAllocatedRecruiter.rows[0].email != null || '' || undefined) {
              emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email, makeOfferSubject, recruiterOfferPath, recruiterOfferReplacements);
            } else {
              console.log('Email Recipient is empty');
            }
            if (positions.rows[0].email != null || '' || undefined) {
              emailClient.emailManager(positions.rows[0].email, makeOfferSubject, recruiterOfferPath, recruiterOfferReplacements);
            } else {
              console.log('Email Recipient is empty');
            }
          }
          resolve({ code: 200, message: 'Hiring step details updated successfully', data: {} });
        }
      } catch (e) {
        console.log('Error raised from try : ', e);
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      }
    })().catch((e) => {
      console.log('Error raised from async : ', e);
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};
