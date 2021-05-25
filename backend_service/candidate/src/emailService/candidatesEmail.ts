import candidateQuery from '../candidates/query/candidates.query';
import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import config from '../config/config';
import { createNotification, createHirerNotifications } from '../common/notifications/notifications';
import * as emailClient from '../emailManager/emailManager';
import { nanoid } from 'nanoid';
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import * as htmlToPdf from "html-pdf-node";
import * as nodeCache from 'node-cache';
import * as utils from '../utils/utils';
import * as rchilliExtractor from '../utils/RchilliExtractor';
import * as https from 'http';
const myCache = new nodeCache();
import fetch from 'node-fetch'
import * as jwt from 'jsonwebtoken';



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
            let positionName = '',hirerName = '',count = 0,names = '',firstName, lastName;

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
            console.log('error : ',e.message)
            await client.query('ROLLBACK')
            throw new Error('Failed to send mail');

        }
    })
}


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>> Remove a freely added candidate.
export const removeCandidate = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {

                // Updating the status of the candidate to false.
                const deleteCandidateQuery = {
                    name: 'delete-candidate',
                    text: candidateQuery.deleteCandidate,
                    values: [_body.candidateId, currentTime, _body.employeeId],
                }
                await client.query(deleteCandidateQuery);
                resolve({ code: 200, message: "Candidate deleted successfully", data: {} });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Update resume share link
export const addResumeShareLink = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                if (!isNaN(_body.candidateId)) {
                    _body.uniqueId = nanoid();
                    let sharedEmails = [], domain = '', flag = 0, filteredEmails = [];

                    let domainResult = await client.query(queryService.getDomainFromEmployeeId(_body));
                    domain = domainResult.rows[0].domain;
                    if (_body.userRoleId == 1) {
                        filteredEmails = _body.sharedEmails
                    }
                    else {
                        filteredEmails = _body.sharedEmails.filter((element) => element.endsWith('@' + domain));
                        _body.sharedEmails.length != filteredEmails.length ? flag = 1 : '';
                    }
                    _body.sharedEmails = filteredEmails;
                    let result = await client.query(queryService.addResumeShare(_body));
                    let results = await client.query(queryService.getNames(_body));
                    if (![null, undefined].includes(result.rows) && result.rows.length > 0) {
                        _body.uniqueId = result.rows[0].unique_key;
                        sharedEmails = _body.sharedEmails;
                        var link = _body.host + '/shareResume/' + _body.uniqueId
                        if (Array.isArray(sharedEmails)) {
                            sharedEmails.forEach(element => {
                                var firstName = results.rows[0].firstname
                                var lastName = results.rows[0].lastname
                                let replacements = {
                                    fName: firstName,
                                    lName: lastName,
                                    link: link
                                };
                                let path = 'src/emailTemplates/resumeShareText.html';
                                if (element != null || '' || undefined) {
                                    emailClient.emailManagerForNoReply(element, config.text.shareEmailSubject, path, replacements);
                                }
                                else {
                                    console.log("Email Recipient is empty")
                                }

                            });
                        }
                    }

                    if (flag == 0)
                        resolve({ code: 200, message: "Candidate resume share link updated", data: sharedEmails });
                    else
                        resolve({ code: 201, message: "The entered email does not belong to your company domain", data: sharedEmails });

                }
                else {
                    reject({ code: 400, message: "Invalid candidateId", data: {} });
                }
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


export const shareResumeSignup = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {

                let result = await client.query(queryService.getSharedEmailsWithToken(_body));
                if (result.rows[0]['sharedEmails'].includes(_body.email)) {
                    let emailCheck = await client.query(queryService.getEmail(_body));
                    if (emailCheck.rowCount == 0) {
                        const getId = {
                            name: 'get-company-id',
                            text: candidateQuery.getCompanyId,
                            values: [result.rows[0].updatedBy],
                        }
                        var getcompanyId = await client.query(getId)
                        var cmpId = getcompanyId.rows[0].company_id
                        const password = passwordGenerator.generate({
                            length: 10,
                            numbers: true
                        });
                        var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                        const insertData = {
                            name: 'insert-values',
                            text: candidateQuery.insertUserDetails,
                            values: [_body.firstName, _body.lastName, _body.email, _body.telephoneNumber, cmpId, hashedPassword, currentTime, true, 2],
                        }
                        await client.query(insertData)
                        let replacements = {
                            fName: _body.firstName,
                            password: password
                        };
                        let path = 'src/emailTemplates/newUserText.html';
                        if (_body.email != null || '' || undefined) {
                            emailClient.emailManager(_body.email, config.text.newUserTextSubject, path, replacements);
                        }
                        else {
                            console.log("Email Recipient is empty")
                        }
                        let adminReplacements = {
                            firstName: _body.firstName,
                            lastName: _body.lastName,
                            email: _body.email,
                            phone: _body.telephoneNumber

                        };
                        let adminPath = 'src/emailTemplates/newUserAdminText.html';
                        const getEllowAdmins = {
                            name: 'get-ellow-admin',
                            text: candidateQuery.getellowAdmins,
                            values: []


                        }
                        var ellowAdmins = await client.query(getEllowAdmins)
                        if (Array.isArray(ellowAdmins.rows)) {
                            ellowAdmins.rows.forEach(element => {
                                if (element.email != null || '' || undefined) {
                                    emailClient.emailManager(element.email, config.text.newUserAdminTextSubject, adminPath, adminReplacements);
                                }
                                else {
                                    console.log("Email Recipient is empty")
                                }
                            })
                        }
                        await client.query('COMMIT')
                        resolve({ code: 200, message: "Employee Added Successfully", data: {} })
                    }
                    else {
                        reject({ code: 400, message: "User already registered.Please use signin to continue", data: {} });
                    }
                }
                else {
                    reject({ code: 400, message: "You do not have sufficient permissions to access this resume", data: {} });

                }

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}





// create pdf
export const createPdfFromHtml = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                var candidateId = _body.candidateId
                let uniqueId = nanoid();
                myCache.set(uniqueId, candidateId);
                let oldEmailResult = await client.query(queryService.saveSharedEmailsForpdf(_body));
                _body.sharedEmails = _body.sharedEmails.filter(elements => elements != null);

                let options = { format: 'A4', printBackground: true, headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
                // Example of options with args //
                // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
                // console.log(`Current directory: ${process.cwd()}`);
                //  let file = {content: fs.readFileSync('./resume.html', 'utf8')};
                let file = { url: _body.host + "/sharePdf/" + uniqueId };

                await htmlToPdf.generatePdf(file, options).then(pdfBuffer => {


                    if (Array.isArray(_body.emailList)) {
                        _body.emailList.forEach(element => {
                            let replacements = {

                            };
                            let path = 'src/emailTemplates/sharePdfText.html';
                            if (element != null || '' || undefined) {
                                emailClient.emailManagerWithAttachments(element, config.text.sharePdfTextSubject, path, replacements, pdfBuffer);
                            }
                            else {
                                console.log("Email Recipient is empty")
                            }
                        })
                    }
                });
                await client.query('COMMIT')

                resolve({ code: 200, message: "Resume in PDF format has been shared", data: {} });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// fetch data for pdf share
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Get the details in a candidate's resume
export const fetchSharedEmailsForPdf = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                let sharedEmails = await client.query(queryService.getSharedEmailsPdf(_body));
                let reqdEmails = ![undefined, null].includes(sharedEmails.rows[0]) ? sharedEmails.rows[0].sharedemails : [];
                resolve({ code: 200, message: "Shared emails listed successfully", data: reqdEmails });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


// fetch data for pdf share
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Get the details in a candidate's resume
export const getCandidateAssesmentDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {

                let query1 = await client.query(queryService.getAssesmentDetails(_body));
                let query2 = await client.query(queryService.getAllocatedVettedStatus(_body));
                let query3 = await client.query(queryService.getEllowAdmins());
                let reviews = query1.rows,
                    candidateVetted = query2.rows[0].candidate_vetted,
                    currentEllowStage = query2.rows[0].current_ellow_stage,
                    allocatedTo = query2.rows[0].allocated_to,
                    admins = query3.rows;
                resolve({ code: 200, message: "Assessment details listed successfully", data: { reviews, candidateVetted, currentEllowStage, allocatedTo, admins } });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// Change assignee of a particular candidate
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> set assignee id to a candidate table 
export const changeAssignee = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                let result = await client.query(queryService.changeCandidateAssignee(_body));
                _body.auditType = 1
                let names = await client.query(queryService.getAssigneeName(_body));
                let assigneeName = names.rows[0].firstname
                let assigneeMail = names.rows[0].email
                _body.auditLogComment = `Assignee for the candidate ${_body.candidateName} has been changed to ${assigneeName}`
                let subject = "ellow Screening Assignee Notification"
                let replacements = {
                    aName: assigneeName,
                    cName: _body.candidateName
                };
                let path = 'src/emailTemplates/changeAssigneeText.html';
                if (assigneeMail != null || '' || undefined) {
                    emailClient.emailManager(assigneeMail, subject, path, replacements);
                }
                else {
                    console.log("Email Recipient is empty")
                }
                await client.query(queryService.insertAuditLog(_body));
                resolve({ code: 200, message: "Assignee changed successfully", data: result.rows });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// Change stage of ellow recuitment
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> set corresponding stage values and flags in candidate related db
export const changeEllowRecruitmentStage = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if ([undefined, null, ''].includes(_body.assignedTo)) {
                    reject({ code: 400, message: "Candidate must be assigned to an assignee", data: {} });
                }
                else {
                    await client.query(queryService.changeEllowRecruitmentStage(_body));
                    await client.query(queryService.updateEllowStageStatus(_body));
                    _body.auditType = 1
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName = names.rows[0].firstname
                    _body.auditLogComment = `Candidate ${_body.candidateName} have been moved to ${_body.stageName} by ${assigneeName}`
                    await client.query(queryService.insertAuditLog(_body));
                    _body.assigneeComment = `${assigneeName} scheduled ${_body.stageName}`
                    await client.query(queryService.updateAssigneeComment(_body));
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Moved to stage successfully", data: {} });
                }
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// Reject at a stage of ellow recruitment
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> set corresponding stage values and flags in candidate_assesment and candidate db
export const rejectFromCandidateEllowRecruitment = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if ([undefined, null, ''].includes(_body.assignedTo)) {
                    reject({ code: 400, message: "Candidate must be assigned to an assignee", data: {} });
                }
                else {
                    await client.query(queryService.rejectFromCandidateEllowRecruitment(_body));
                    _body.auditType = 1
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName = names.rows[0].firstname
                    _body.auditLogComment = `Candidate ${_body.candidateName} has been rejected at ${_body.stageName} by ${assigneeName}`
                    await client.query(queryService.insertAuditLog(_body));
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Rejected candiate successfully", data: {} });
                }
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Get logs of hiring steps from the database
export const getAllAuditLogs = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                let results = await client.query(queryService.getAuditLogs(_body));
                resolve({ code: 200, message: "Rejected candiate successfully", data: { logs: results.rows } });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>Listing all the free candidates from the candidates list of hirer.
export const listHirerResources = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = candidateQuery.listFreeCandidatesOfHirerFromView, totalQuery = candidateQuery.listFreeCandidatesofHirerTotalCount, vettedQuery = '';
        var queryText = '', searchQuery = '', queryValues = {}, filterQuery = '', filter = _body.body != undefined ? _body.body.filter : '',
            body = _body.query;

        // Search for filters in the body        
        let filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
        filterQuery = filterResult.filterQuery;
        queryValues = filterResult.queryValues;

        // Search for company name / candidate name
        let searchResult = utils.resourceSearch(body, queryValues);
        searchQuery = searchResult.searchQuery;
        queryValues = searchResult.queryValues;

        (async () => {
            const client = await database()
            try {
                queryText = selectQuery + utils.resourceHirerTab(body) + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
                var queryCountText = totalQuery + utils.resourceHirerTab(body) + filterQuery + searchQuery
                queryValues = Object.assign({ hirercompanyid: _body.body.companyId }, queryValues)

                const candidatesResult = await client.query(queryService.listCandidatesOfHirer(queryText, queryValues));
                const totalCount = await client.query(queryService.listCandidatesOfHirerCount(queryCountText, queryValues))
                resolve({ code: 200, message: "Candidate Listed successfully", data: { candidates: candidatesResult.rows, totalCount: totalCount.rows[0].totalCount } });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// >>>>>>> FUNC. >>>>>>>
// Change availability of a candidate    
export const changeAvailability = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query(queryService.changeAvailabilityOfCandidate(_body));
                await client.query('COMMIT')
                resolve({ code: 200, message: "Availability changed successfully", data: {} });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// >>>>>>> FUNC. >>>>>>>
// blacklist or revert blacklist candidate    
export const changeBlacklisted = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {

                await client.query(queryService.changeBlacklistedOfCandidate(_body));
                const getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: candidateQuery.getellowAdmins,
                    values: []

                }
                var ellowAdmins = await client.query(getEllowAdmins)
                var candidateDetails = await client.query(queryService.getCandidateProfileName(_body))
                _body.name = candidateDetails.rows[0].name
                if (_body.blacklisted == true) {
                    _body.subject = "Candidate Blacklist Notification";
                    _body.path = 'src/emailTemplates/addToBlacklistMail.html';
                    _body.adminReplacements = {
                        fName: _body.name
                    }
                }
                else {
                    _body.subject = "Candidate Unblock Notification";
                    _body.path = 'src/emailTemplates/removeFromBlacklistMail.html';
                    _body.adminReplacements = {
                        fName: _body.name
                    }
                }
                if (Array.isArray(ellowAdmins.rows)) {
                    ellowAdmins.rows.forEach(element => {
                        if (element.email != null || '' || undefined) {
                            emailClient.emailManager(element.email, _body.subject, _body.path, _body.adminReplacements);
                        }
                        else {
                            console.log("Email Recipient is empty")
                        }
                    })
                }

                resolve({ code: 200, message: "Blacklisted toggled successfully", data: {} });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>Function to edit the vetting status of the candidate.
export const singleSignOn = (_body) => {
    return new Promise((resolve, reject) => {
        var employeeId, candidateId
        (async () => {
            const client = await database()
            try {
                console.log("body code : ", _body.code);

                const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=https%3A%2F%2Fdevcandidate.ellow.io%2Fapi%2Fv1%2Fcandidates%2FsingleSignOn&client_id=867umqszmeupfh&client_secret=n7oVJe6kbinpdPqu&code=' + _body.code, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ a: 1, b: 'Textual content' })
                });
                const content = await tokenResponse.json();
                const accessToken = content.access_token;

                const profile = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
                    method: 'GET',
                    headers: {
                        'Host': "api.linkedin.com",
                        'Connection': "Keep-Alive",
                        'Authorization': 'Bearer ' + accessToken,
                        'cache-control': 'no-cache',
                        'X-Restli-Protocol-Version': '2.0.0'
                    },
                });
                const profileResult = await profile.json();
                console.log("profileResult : ", profileResult);
                _body.firstName = profileResult['firstName']['localized']['en_US']
                _body.lastName = profileResult['lastName']['localized']['en_US']
                console.log(_body.firstName, _body.lastName)
                const emailAddress = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
                    method: 'GET',
                    headers: {
                        'Host': "api.linkedin.com",
                        'Connection': "Keep-Alive",
                        'Authorization': 'Bearer ' + accessToken,
                        'cache-control': 'no-cache',
                        'X-Restli-Protocol-Version': '2.0.0'
                    },
                });
                const emailAddressResult = await emailAddress.json();
                _body.email = emailAddressResult.elements[0]['handle~']['emailAddress']
                console.log(_body.email)
                var results = await client.query(queryService.linkedinLoginMailCheck(_body));
                _body.companyName = 'Freelancer'
                var companyResults = await client.query(queryService.getCompanyDetailsFromName(_body));
                _body.cmpId = companyResults.rows[0].company_id
                _body.userRoleId = 4
                if (results.rowCount == 0) {
                    var employeeResult = await client.query(queryService.insertLinkedinToEmployee(_body));
                    employeeId = employeeResult.rows[0].employee_id
                    console.log(employeeId)
                    var candidateResult = await client.query(queryService.insertLinkedinToCandidate(_body));
                    candidateId = candidateResult.rows[0].candidate_id
                    _body.employeeId = employeeId
                    _body.candidateId = candidateId
                    await client.query(queryService.insertLinkedinToCandidateEmployee(_body));
                    _body.token = jwt.sign({
                        employeeId: employeeId.toString(),
                        companyId: _body.cmpId.toString(),
                        userRoleId: _body.userRoleId.toString()
                    }, config.jwtSecretKey, { expiresIn: '24h' });
                    await client.query(queryService.insertEmployeeToken(_body));
                }
                else {
                    employeeId = results.rows[0].employee_id
                    _body.employeeId = employeeId
                    if (results.rows[0].password == null && results.rows[0].linkedin_token !== null) {
                        const getQuery = {
                            name: 'get-employee-details',
                            text: candidateQuery.getLoginDetailFromEmployeeId,
                            values: [_body.employeeId],
                        }
                        var results = await client.query(getQuery);
                        const data = results.rows
                        if (data.length > 0) {
                            const value = data[0];
                            if (value.status) {
                                _body.token = value.linkedinToken
                            }
                            else {
                                reject({ code: 400, message: "User does not exist.", data: {} });

                            }
                        }
                    }
                    else {
                        reject({ code: 400, message: "User already registered.Please login with your email and password provided!", data: {} });

                    }
                }
                await client.query('COMMIT');
                // console.log("emailAddressResult : ",JSON.stringify(emailAddressResult));
                resolve({ code: 200, message: "Candidate SSO successfull", data: { token: _body.token } })

            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}


export const getLinkedinEmployeeLoginDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');

                // Inserting the integer representing the vetting status value.
                const getQuery = {
                    name: 'get-employee-details',
                    text: candidateQuery.getDetailsUsingLinkedinToken,
                    values: [_body.token],
                }
                var results = await client.query(getQuery);
                const data = results.rows
                if (data.length > 0) {
                    const value = data[0];
                    if (value.status) {
                        resolve({
                            code: 200, message: "Login successful", data: {
                                token: `Bearer ${_body.token}`,
                                companyName: value.companyName, companyLogo: value.companyLogo,
                                candidateId: value.candidateId, candidateStatus: value.candidateStatus,
                                email: value.email, firstName: value.firstName, lastName: value.lastName, accountType: value.accountType,
                                masked: value.masked, currencyTypeId: value.currencyTypeId, companyProfile: value.companyProfile, userRoleId: value.userRoleId
                            }
                        });
                    }
                    else {
                        reject({ code: 400, message: "Employee does not exist.", data: {} });

                    }
                }

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}




// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>Listing all the free candidates from the candidates list of provider.
export const listProviderResources = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = candidateQuery.listFreeCandidatesOfProviderFromView, totalQuery = candidateQuery.listFreeCandidatesofProviderTotalCount, vettedQuery = '';
        var queryText = '', searchQuery = '', queryValues = {}, filterQuery = '', filter = _body.body != undefined ? _body.body.filter : '',
            body = _body.query;

        // Search for filters in the body        
        let filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
        filterQuery = filterResult.filterQuery;
        queryValues = filterResult.queryValues;

        // Search for company name / candidate name
        let searchResult = utils.resourceSearch(body, queryValues);
        searchQuery = searchResult.searchQuery;
        queryValues = searchResult.queryValues;

        (async () => {
            const client = await database()
            try {
                queryText = selectQuery + utils.resourceHirerTab(body) + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
                var queryCountText = totalQuery + utils.resourceHirerTab(body) + filterQuery + searchQuery
                queryValues = Object.assign({ providerCompanyId: _body.body.companyId }, queryValues)

                const candidatesResult = await client.query(queryService.listCandidatesOfProvider(queryText, queryValues));
                const totalCount = await client.query(queryService.listCandidatesOfProviderCount(queryCountText, queryValues))
                resolve({ code: 200, message: "Candidate Listed successfully", data: { candidates: candidatesResult.rows, totalCount: totalCount.rows[0].totalCount } });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}








// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Update resume share link
export const addResumeShareLink = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                if (!isNaN(_body.candidateId)) {
                    _body.uniqueId = nanoid();
                    let sharedEmails = [], domain = '', flag = 0, filteredEmails = [];

                    let domainResult = await client.query(queryService.getDomainFromEmployeeId(_body));
                    domain = domainResult.rows[0].domain;
                    if (_body.userRoleId == 1) {
                        filteredEmails = _body.sharedEmails
                    }
                    else {
                        filteredEmails = _body.sharedEmails.filter((element) => element.endsWith('@' + domain));
                        _body.sharedEmails.length != filteredEmails.length ? flag = 1 : '';
                    }
                    _body.sharedEmails = filteredEmails;
                    let result = await client.query(queryService.addResumeShare(_body));
                    let results = await client.query(queryService.getNames(_body));
                    if (![null, undefined].includes(result.rows) && result.rows.length > 0) {
                        _body.uniqueId = result.rows[0].unique_key;
                        sharedEmails = _body.sharedEmails;
                        var link = _body.host + '/shareResume/' + _body.uniqueId
                        if (Array.isArray(sharedEmails)) {
                            sharedEmails.forEach(element => {
                                var firstName = results.rows[0].firstname
                                var lastName = results.rows[0].lastname
                                let replacements = {
                                    fName: firstName,
                                    lName: lastName,
                                    link: link
                                };
                                let path = 'src/emailTemplates/resumeShareText.html';
                                if (element != null || '' || undefined) {
                                    emailClient.emailManagerForNoReply(element, config.text.shareEmailSubject, path, replacements);
                                }
                                else {
                                    console.log("Email Recipient is empty")
                                }

                            });
                        }
                    }

                    if (flag == 0)
                        resolve({ code: 200, message: "Candidate resume share link updated", data: sharedEmails });
                    else
                        resolve({ code: 201, message: "The entered email does not belong to your company domain", data: sharedEmails });

                }
                else {
                    reject({ code: 400, message: "Invalid candidateId", data: {} });
                }
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}