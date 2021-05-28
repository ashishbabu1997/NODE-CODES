import * as queryService from '../queryService/queryService';
import config from '../config/config';
import { createNotification, createHirerNotifications } from '../common/notifications/notifications';
import * as emailClient from '../emailManager/emailManager';
import * as utils from '../utils/utils';

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>Email Function for admin to add reviews,assesment comments about the candidate
export const addCandidateReviewEmail = (_body, client) => {
    (async () => {
        try {
            let candidateDetailResults = await client.query(queryService.getCandidateProfileName(_body));

            let subject = "Congrats! You have successfully completed ellow Certification."
            let path = 'src/emailTemplates/ellowVettedText.html';
            let replacements = {
                name: candidateDetailResults.rows[0].name
            };

            if (utils.notNull(candidateDetailResults.rows[0].email))
                emailClient.emailManager(candidateDetailResults.rows[0].email, subject, path, replacements);
        } catch (e) {
            console.log(e.message)
            await client.query('ROLLBACK')
            throw new Error('Failed to send mail');
        }
    })
}


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>Email Function to remove a candidate from a position by admin and sending a notification email to the provider who added this candidate.
export const removeCandidateFromPositionEmail = (_body, client) => {
    var jobReceivedId, candidateFirstName, candidateLastName, message, positionName, hirerName;

    (async () => {
        try {
            var candidateId = _body.candidateId;
            var positionId = _body.positionId;

            // Retreving the details of the candidate to add to the mail
            var positionDetail = await client.query(queryService.getPositionDetails(_body));
            // query to retrieve the provider's(seller's) email address.
            var emailResults = await client.query(queryService.getProviderEmailFromCandidateId(_body));
            let imageResults = await client.query(queryService.getImageDetails(_body))
            let resourceAllocatedRecruiter = await client.query(queryService.getResourceAllocatedRecruiter(_body));
            var hirerDetails = await client.query(queryService.getPositionName(_body));

            positionName = positionDetail.rows[0].positionName
            hirerName = positionDetail.rows[0].hirerName

            var sellerMail = emailResults.rows[0].email
            candidateFirstName = emailResults.rows[0].cFirstName
            candidateLastName = emailResults.rows[0].cLastName

            var subject = "Candidate Removal Notification";
            message = `${candidateFirstName + ' ' + candidateLastName} who had applied for the position ${positionName} has been removed `

            let path = 'src/emailTemplates/candidateDeletionMailText.html';

            let replacements = {
                position: positionName,
                name1: candidateFirstName,
                name2: candidateLastName
            };

            if (utils.notNull(sellerMail))
                emailClient.emailManager(sellerMail, subject, path, replacements);

            if (utils.notNull(resourceAllocatedRecruiter.rows[0].email))
                emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email, subject, path, replacements);

            if (utils.notNull(hirerDetails.rows[0].email)) {
                emailClient.emailManager(hirerDetails.rows[0].email, subject, path, replacements);
            }

            await createNotification({ positionId, jobReceivedId, companyId: _body.companyId, message, candidateId, notificationType: 'candidateChange', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: imageResults.rows[0].image, firstName: imageResults.rows[0].candidate_first_name, lastName: imageResults.rows[0].candidate_last_name })

        } catch (e) {
            console.log(e.message)
            await client.query('ROLLBACK')
            throw new Error('Failed to send mail');

        }
    })
}



// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>Emails for Link the candidates to a particular position .
export const linkCandidateWithPositionEMail = (_body, client) => {
    (async () => {
        try {
            const candidateList = _body.candidates;
            let positionName = '', hirerName = '', count = 0, names = '', firstName, lastName;

            var ellowAdmins = await client.query(queryService.getEllowAdmins())
            var positionResult = await client.query(queryService.getPositionDetails(_body));

            // Get position realted details
            positionName = positionResult.rows[0].positionName
            hirerName = positionResult.rows[0].hirerName
            var hirerCompanyId = positionResult.rows[0].companyId
            var jobReceivedId = positionResult.rows[0].jobReceivedId

            // Sending email to each candidate linked to a position
            for (const element of candidateList) {

                let imageResults = await client.query(queryService.getImageDetails(element));
                firstName = utils.capitalize(imageResults.rows[0].candidate_first_name);
                lastName = utils.capitalize(imageResults.rows[0].candidate_last_name);

                names += `${firstName} ${lastName} \n`
                var email = imageResults.rows[0].email_address

                let replacements = { name: firstName, positionName: positionName };
                let path = 'src/emailTemplates/addCandidatesUsersText.html';

                if (utils.notNull(email))
                    emailClient.emailManager(email, config.text.addCandidatesUsersTextSubject, path, replacements);
            }

            // Sending email to ellow recuiter for each candidate linked to a position
            if (Array.isArray(ellowAdmins.rows)) {

                let replacements = { positionName: positionName, candidateNames: names };
                let path = 'src/emailTemplates/addCandidatesText.html';

                ellowAdmins['rows'].forEach(element => {
                    if (utils.notNull(element.mail))
                        emailClient.emailManager(element.email, config.text.addCandidatesTextSubject, path, replacements);
                })
            }

            let message = `${count} candidates has been added for the position ${positionName}`
            createHirerNotifications({ positionId: _body.positionId, jobReceivedId: jobReceivedId, companyId: hirerCompanyId, message: message, candidateId: null, notificationType: 'candidateList', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: null, firstName: null, lastName: null })
            createNotification({ positionId: _body.positionId, jobReceivedId: jobReceivedId, companyId: _body.companyId, message: message, candidateId: null, notificationType: 'candidateList', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: null, firstName: null, lastName: null })

        } catch (e) {
            console.log('error : ', e.message)
            await client.query('ROLLBACK')
            throw new Error('Failed to send mail');

        }
    })
}

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Update resume share link
export const addResumeShareLinkEmail = (_body) => {
    try {
        let sharedEmails = [];
        sharedEmails = _body.sharedEmails;

        var link = _body.host + '/shareResume/' + _body.uniqueId
        if (Array.isArray(sharedEmails)) {
            sharedEmails.forEach(element => {
                var firstName = _body.firstname
                var lastName = _body.lastname
                let replacements = {
                    fName: firstName,
                    lName: lastName,
                    link: link
                };
                let path = 'src/emailTemplates/resumeShareText.html';
                if (utils.notNull(element))
                    emailClient.emailManagerForNoReply(element, config.text.shareEmailSubject, path, replacements);
            });
        }

    } catch (e) {
        console.log('error  : ', e.message)
        throw new Error('Failed to send mail');
    }
}


export const shareResumeSignupEmail = (_body, client) => {
    (async () => {
        try {

            let replacements = { fName: _body.firstName, password: _body.password };
            let path = 'src/emailTemplates/newUserText.html';
            if (utils.notNull(_body.email))
                emailClient.emailManager(_body.email, config.text.newUserTextSubject, path, replacements);

            let adminReplacements =
            {
                firstName: _body.firstName, lastName: _body.lastName, email: _body.email,
                phone: _body.telephoneNumber
            };

            let adminPath = 'src/emailTemplates/newUserAdminText.html';
            var ellowAdmins = await client.query(queryService.getEllowAdmins())
            if (Array.isArray(ellowAdmins.rows)) {
                ellowAdmins.rows.forEach(element => {
                    if (utils.notNull(element.email))
                        emailClient.emailManager(element.email, config.text.newUserAdminTextSubject, adminPath, adminReplacements);
                })
            }

        } catch (e) {
            console.log("error : ", e.message);
            throw new Error('Failed to send mail');
        }
    })
}

// create pdf
export const createPdfFromHtmlEmail = (_body, pdfBuffer) => {
    try {
        if (Array.isArray(_body.emailList)) {
            _body.emailList.forEach(element => {
                let replacements = {};

                let path = 'src/emailTemplates/sharePdfText.html';
                if (utils.notNull(element))
                    emailClient.emailManagerWithAttachments(element, config.text.sharePdfTextSubject, path, replacements, pdfBuffer);
            })
        }

    } catch (e) {
        console.log("error : ", e.message);
        throw new Error('Failed to send mail');
    }
}



// Change assignee of a particular candidate
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> set assignee id to a candidate table 
export const changeAssigneeEmail = (_body, client) => {
    (async () => {
        try {
            _body.auditType = 1
            let names = await client.query(queryService.getAssigneeName(_body));
            let assigneeName = names.rows[0].firstname
            let assigneeMail = names.rows[0].email
            _body.auditLogComment = `Assignee for the candidate ${_body.candidateName} has been changed to ${assigneeName}`
            let subject = "ellow Screening Assignee Notification"

            let replacements = { aName: assigneeName, cName: _body.candidateName };
            let path = 'src/emailTemplates/changeAssigneeText.html';

            if (utils.notNull(assigneeMail))
                emailClient.emailManager(assigneeMail, subject, path, replacements);

            await client.query(queryService.insertAuditLog(_body));
        } catch (e) {
            console.log("errors : ", e.message)
            throw new Error('Failed to send mail');
        }
    })
}

// Change stage of ellow recuitment
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> set corresponding stage values and flags in candidate related db
export const changeEllowRecruitmentStageEmail = (_body, client) => {
    (async () => {
        try {
            _body.auditType = 1
            let names = await client.query(queryService.getAssigneeName(_body));
            let assigneeName = names.rows[0].firstname
            _body.auditLogComment = `Candidate ${_body.candidateName} have been moved to ${_body.stageName} by ${assigneeName}`
            await client.query(queryService.insertAuditLog(_body));
            _body.assigneeComment = `${assigneeName} scheduled ${_body.stageName}`
            await client.query(queryService.updateAssigneeComment(_body));

        } catch (e) {
            console.log("errors : ", e.message)
            throw new Error('Failed to send mail');
        }
    })
}


// Reject at a stage of ellow recruitment
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> set corresponding stage values and flags in candidate_assesment and candidate db
export const rejectFromCandidateEllowRecruitmentEmail = (_body,client) => {
        (async () => {
            try {
                _body.auditType = 1
                let names = await client.query(queryService.getAssigneeName(_body));
                let assigneeName = names.rows[0].firstname
                _body.auditLogComment = `Candidate ${_body.candidateName} has been rejected at ${_body.stageName} by ${assigneeName}`
                await client.query(queryService.insertAuditLog(_body));
            } catch (e) {
                console.log("errors : ", e.message)
                throw new Error('Failed to send mail');
            }
        })
}


// >>>>>>> FUNC. >>>>>>>
// Email blacklist or revert blacklist candidate    
export const changeBlacklistedEmail = (_body, client) => {
    (async () => {
        try {
            var ellowAdmins = await client.query(queryService.getEllowAdmins())

            var candidateDetails = await client.query(queryService.getCandidateProfileName(_body))
            _body.name = candidateDetails.rows[0].name

            if (_body.blacklisted) {
                _body.subject = "Candidate Blacklist Notification";
                _body.path = 'src/emailTemplates/addToBlacklistMail.html';
            }
            else {
                _body.subject = "Candidate Unblock Notification";
                _body.path = 'src/emailTemplates/removeFromBlacklistMail.html';
            }

            _body.adminReplacements = { fName: _body.name }

            if (Array.isArray(ellowAdmins.rows)) {

                ellowAdmins.rows.forEach(element => {
                    if (utils.notNull(element.email))
                        emailClient.emailManager(element.email, _body.subject, _body.path, _body.adminReplacements);
                })
            }
        } catch (e) {
            console.log("error : ", e.message);
            throw new Error('Failed to send mail');
        }
    })
}