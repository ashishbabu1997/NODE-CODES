import candidateQuery from './query/candidates.query';
import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import config from '../config/config';
import { createNotification, createHirerNotifications } from '../common/notifications/notifications';
import * as emailClient from '../emailService/emailService';
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
import { getHeapSpaceStatistics } from 'v8';


// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for listing all the candidates with his/her basic details.
export const listCandidatesDetails = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = candidateQuery.listCandidates;

        var adminApproveQuery = '', queryText = '', searchQuery = '', queryValues = {}, filterQuery = '', filter = _body.body != undefined ? _body.body.filter : '',
            body = _body.query, sort = '', searchKey = '%%';

        // Sorting keys to add with the query
        const orderBy = {
            "updatedOn": 'ca.updated_on',
            "candidateFirstName": 'ca.candidate_first_name',
            "candidateLastName": 'ca.candidate_last_name',
            "rate": 'ca.rate',
            "ellowRate": 'cp.ellow_rate',
            "companyName": 'c.company_name'
        }

        // Search for filters to add with the query
        if (filter) {
            if (filter.name) {
                filterQuery = filterQuery + ' AND (ca.candidate_first_name ILIKE $name OR ca.candidate_last_name ILIKE $name) '
                queryValues = Object.assign({ name: filter.candidateName })
            }
            if (filter.email) {
                filterQuery = filterQuery + ' AND email ILIKE $email'
                queryValues = Object.assign({ email: filter.email }, queryValues)
            }
            if (filter.minCost && filter.maxCost) {
                filterQuery = filterQuery + ' AND (ca.rate BETWEEN $mincost AND $maxcost)'
                queryValues = Object.assign({ mincost: filter.minCost, maxcost: filter.maxCost }, queryValues)
            }
            if (filter.minRate && filter.maxRate) {
                filterQuery = filterQuery + ' AND (cp.ellow_rate BETWEEN $minrate AND $maxrate)'
                queryValues = Object.assign({ minrate: filter.minRate, maxrate: filter.maxRate }, queryValues)
            }

        }

        if (![undefined, null, ''].includes(body.filter)) {
            searchKey = '%' + body.filter + '%';
            searchQuery = " AND (ca.candidate_first_name ILIKE $searchkey OR ca.candidate_last_name ILIKE $searchkey OR c.company_name ILIKE $searchkey) "
            queryValues = Object.assign({ searchkey: searchKey }, queryValues)
        }

        if (body.userRoleId != 1) {
            adminApproveQuery = " AND cp.admin_approve_status = 1"
        }

        if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
            sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;
        }

        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                queryText = selectQuery + adminApproveQuery + filterQuery + searchQuery + sort;
                queryValues = Object.assign({ positionid: body.positionId, employeeid: body.employeeId }, queryValues)

                const candidatesResult = await client.query(queryService.listCandidates(queryText, queryValues));
                const jobReceivedIdResult = await client.query(queryService.getJobReceivedId(body));
                await client.query('COMMIT');

                resolve({ code: 200, message: "Candidate Listed successfully", data: { jobReceivedId: jobReceivedIdResult.rows[0].job_received_id, allCandidates: candidatesResult.rows } });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })

    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>Listing all the free candidates from the candidates list.
export const listFreeCandidatesDetails = (_body) => {
    return new Promise((resolve, reject) => {

        var selectQuery = candidateQuery.listFreeCandidatesFromView;
        let totalQuery = candidateQuery.listFreeCandidatesTotalCount;
        var roleBasedQuery = '', queryText = '', searchQuery = '', queryValues = {}, filterQuery = '', filter = _body.body != undefined ? _body.body.filter : '',
            body = _body.query, reqBody = _body.body;

        // Search for filters in the body        
        let filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
        filterQuery = filterResult.filterQuery;
        queryValues = filterResult.queryValues;

        // Apply query based on userRoleId      
        let roleBasedQueryResult = utils.listFreResourceRoleBased(reqBody, queryValues);
        roleBasedQuery = roleBasedQueryResult.roleBasedQuery;
        queryValues = roleBasedQueryResult.queryValues;

        // Search for company name / candidate name
        let searchResult = utils.resourceSearch(body, queryValues);
        searchQuery = searchResult.searchQuery;
        queryValues = searchResult.queryValues;

        (async () => {
            const client = await database()
            try {
                queryText = selectQuery + roleBasedQuery + utils.resourceTab(body) + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
                queryValues = Object.assign({ positionid: body.positionId, employeeid: body.employeeId }, queryValues)
                let candidateList = await client.query(queryService.listCandidates(queryText, queryValues));

                var queryCountText = totalQuery + roleBasedQuery + utils.resourceTab(body) + filterQuery + searchQuery;
                let candidateTotal = await client.query(queryService.listCandidatesTotal(queryCountText, queryValues));

                let candidates = candidateList.rows;
                let totalCount = candidateTotal.rows[0].totalCount;

                resolve({ code: 200, message: "Candidate Listed successfully", data: { candidates, totalCount } });
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
//>>>>>>>>>>>Listing required candidates for add from list from the candidates list.
export const listAddFromListCandidates = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = candidateQuery.getCandidateForAddFromListView;
        var totaltQuery = candidateQuery.addFromListTotalCount;
        var roleBasedQuery = '', queryText = '', searchQuery = '', queryValues = {}, filterQuery = '', filter = _body.body != undefined ? _body.body.filter : '',
            body = _body.query, reqBody = _body.body;

        // Search for filters in the body        
        let filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
        filterQuery = filterResult.filterQuery;
        queryValues = filterResult.queryValues;

        // Search for company name / candidate name
        let searchResult = utils.resourceSearch(body, queryValues);
        searchQuery = searchResult.searchQuery;
        queryValues = searchResult.queryValues;

        // Apply query based on userRoleId      
        let roleBasedQueryResult = utils.resourceRoleBased(reqBody, queryValues);
        roleBasedQuery = roleBasedQueryResult.roleBasedQuery;
        queryValues = roleBasedQueryResult.queryValues;

        (async () => {
            const client = await database()
            try {
                queryText = selectQuery + roleBasedQuery + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
                queryValues = Object.assign({ positionid: body.positionId }, queryValues)
                const candidatesResult = await client.query(queryService.listAddFromList(queryText, queryValues));

                queryText = totaltQuery + roleBasedQuery + filterQuery + searchQuery;
                const totalCountResult = await client.query(queryService.listAddFromListTotal(queryText, queryValues));

                resolve({ code: 200, message: "Candidate Listed successfully", data: { candidates: candidatesResult.rows, totalCount: totalCountResult.rows[0].totalCount } });
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
//>>>>>>>> Function for approving or rejecting a candidate.
export const candidateClearance = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var adminApproveStatus;
                var comment;
                var subj;
                var candidateQueries;
                var makeOffer;
                var value;
                let message = ``

                // Get the details of a candidate.
                const getCandidateName = {
                    name: 'get-candidate-names',
                    text: candidateQuery.getCandidateNames,
                    values: [_body.candidateId, _body.positionId]
                }
                const results = await client.query(getCandidateName);
                const candidateDetails = results.rows[0];
                const { firstName, lastName, jobReceivedId, companyName, positionName } = candidateDetails;

                // Checking :
                //          a)If the decision is approve or reject (decisionValue 1 or 2)
                //          b)If the login user is a ellow recruiter or hirer.    ( 1-ellow recruiter,2-admin)
                if (_body.decisionValue == 1) {
                    if (_body.userRoleId == 1) {
                        adminApproveStatus = 1
                        comment = _body.comment
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, _body.ellowRate, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateSuperAdminApprovalQuery
                    }
                    else if (_body.userRoleId == 2) {
                        message = `${companyName} has selected ${firstName + ' ' + lastName}   for their position ${positionName}`;
                        makeOffer = 1
                        adminApproveStatus = 1;
                        comment = _body.comment;
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, makeOffer, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateAdminApprovalQuery

                        // Sending a approval mail to the admin , with candidates details
                        subj = "Candidate Selection Mail";
                        let path = 'src/emailTemplates/selectionMailText.html';
                        let adminReplacements = {
                            fName: firstName,
                            lName: lastName,
                            cName: companyName,
                            pName: positionName
                        };
                        const getEllowAdmins = {
                            name: 'get-ellow-admin',
                            text: candidateQuery.getellowAdmins,
                            values: []


                        }
                        var ellowAdmins = await client.query(getEllowAdmins)
                        if (Array.isArray(ellowAdmins.rows)) {
                            ellowAdmins.rows.forEach(element => {
                                if(element.email!=null || '' || undefined)
                                {
                                    emailClient.emailManager(element.email, subj, path, adminReplacements);
                                }
                                else
                                {
                                    console.log("Email Recipient is empty")
                                } 
                            })
                        }
                    }
                } else {
                    if (_body.userRoleId == 1) {
                        adminApproveStatus = 0
                        comment = _body.comment
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateSuperAdminRejectQuery
                    } else if (_body.userRoleId != 1) {
                        message = `${companyName} has rejected ${firstName + ' ' + lastName}    for the position ${positionName}`;
                        makeOffer = 0
                        adminApproveStatus = 1;
                        comment = _body.comment;
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, makeOffer, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateAdminApprovalQuery
                        subj = "Candidate Rejection Mail";
                        let path = 'src/emailTemplates/rejectionMailText.html';
                        let adminReplacements = {
                            fName: firstName,
                            lName: lastName,
                            cName: companyName,
                            pName: positionName
                        };
                        const getEllowAdmins = {
                            name: 'get-ellow-admin',
                            text: candidateQuery.getellowAdmins,
                            values: []


                        }
                        var ellowAdmins = await client.query(getEllowAdmins)
                        if (Array.isArray(ellowAdmins.rows)) {

                            ellowAdmins.rows.forEach(element => {
                                if(element.email!=null || '' || undefined)
                                {
                                    emailClient.emailManager(element.email, subj, path, adminReplacements);
                                }
                                else
                                {
                                    console.log("Email Recipient is empty")
                                } 
                            })
                        }
                    }
                }
                const candidateApprovalQuery = {
                    name: 'admin',
                    text: candidateQueries,
                    values: value
                }
                await client.query(candidateApprovalQuery);
                const updateQuery = {
                    name: 'update-candidate-vetting',
                    text: candidateQuery.updateCandidateVetting,
                    values: [_body.candidateId, 1, _body.employeeId, currentTime],
                }
                await client.query(updateQuery);
                await client.query('COMMIT');


                // Function for notification to the  admin
                let imageResults = await client.query(queryService.getImageDetails(_body))
                _body.userRoleId != 1 && await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: imageResults.rows[0].image, firstName: imageResults.rows[0].candidate_first_name, lastName: imageResults.rows[0].candidate_last_name });
                resolve({ code: 200, message: "Candidate Clearance Successsfull", data: {} });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// >>>>>>> Function for requesting interview to a candidate
// The hirer views a ellow shortlisted candidate and request for an interview him/her.
// A notification and a mail will be sent to the admin about the interview request.
export const interviewRequestFunction = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');

                // Insert make offer status of a candidate.
                const insertQuery = {
                    name: 'insert-make-offer-status',
                    text: candidateQuery.insertMakeOfferStatus,
                    values: [_body.candidateId, _body.positionId, _body.employeeId, currentTime],
                }
                await client.query(insertQuery);

                // Retrieving the candidate's basic details.
                const candidateDetails = {
                    name: 'get-interview-details',
                    text: candidateQuery.getInterviewDetails,
                    values: [_body.candidateId, _body.companyId, _body.positionId],
                }
                const result = await client.query(candidateDetails);
                await client.query('COMMIT');
                var interviewDetails = result.rows

                let { jobReceivedId, candidateFirstName, candidateLastName } = interviewDetails[0];

                const message = `An interview request has been received for the candidate ${candidateFirstName + ' ' + candidateLastName}`
                let imageResults = await client.query(queryService.getImageDetails(_body))
                await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: imageResults.rows[0].image, firstName: imageResults.rows[0].candidate_first_name, lastName: imageResults.rows[0].candidate_last_name })

                var hirer = interviewDetails[0].hirerCompanyName
                var hirerCompanyName=hirer.charAt(0).toUpperCase() + hirer.slice(1)
                candidateFirstName = interviewDetails[0].candidateFirstName === null ? '' : interviewDetails[0].candidateFirstName
                candidateLastName = interviewDetails[0].candidateLastName === null ? '' : interviewDetails[0].candidateLastName
                var positionName = interviewDetails[0].positionName === null ? '' : interviewDetails[0].positionName
                var email = interviewDetails[0].emailAddress === null ? '' : interviewDetails[0].emailAddress
                var phoneNumber = interviewDetails[0].phoneNumber === null ? '' : interviewDetails[0].phoneNumber
                var subject = "Interview Requested from " + hirerCompanyName;
                let path = 'src/emailTemplates/interviewRequestMailText.html';
                let adminReplacements = {
                    hirerName: hirerCompanyName,
                    firstName: candidateFirstName,
                    lastName: candidateLastName,
                    position: positionName,
                    emailId: email,
                    telephoneNumber: phoneNumber
                };
                const getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: candidateQuery.getellowAdmins,
                    values: []


                }
                var ellowAdmins = await client.query(getEllowAdmins)
                if (Array.isArray(ellowAdmins.rows)) {

                    ellowAdmins.rows.forEach(element => {
                        if(element.email!=null || '' || undefined)
                                {
                                    emailClient.emailManager(element.email, subject, path, adminReplacements);
                                }
                                else
                                {
                                    console.log("Email Recipient is empty")
                                } 
                    })
                }
                resolve({ code: 200, message: "Interview request has been sent successfully", data: {} });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>> Function for admin to add reviews,assesment comments about the candidate
export const addCandidateReview = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if ([undefined, null, ''].includes(_body.assignedTo)) {
                    reject({ code: 400, message: "Candidate must be assigned to an assignee", data: {} });
                }
                else {
                    await client.query('BEGIN');
                    // Update assesment ratings about the candidate.
                    let result = await client.query(queryService.updateEllowRecuiterReview(_body));

                    if (_body.stageName == 'ellow Onboarding') {
                        _body.candidateId = result.rows[0].candidate_id;
                        await client.query(queryService.setVettedStatus(_body));
                        let candidateDetailResults = await client.query(queryService.getCandidateProfileName(_body));
                        let subject = "Congrats! You have successfully completed ellow Certification!"
                        let path = 'src/emailTemplates/ellowVettedText.html';
                        let replacements = {
                            name: candidateDetailResults.rows[0].name
                        };
                        if(candidateDetailResults.rows[0].email!=null || '' || undefined)
                        {
                            emailClient.emailManager(candidateDetailResults.rows[0].email, subject, path, replacements);
                        }
                        else
                        {
                            console.log("Email Recipient is empty")
                        } 

                    }
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Candidate Assesment Updated successfully", data: {} });
                    await client.query('COMMIT')
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
//>>>>>>>>>>>>>>>Function to edit the vetting status of the candidate.
export const editVettingStatus = (_body) => {
    return new Promise((resolve, reject) => {
        const candidateId = _body.candidateId;
        const vettingStatus = _body.candidateVetted;
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');

                // Inserting the integer representing the vetting status value.
                const updateQuery = {
                    name: 'update-candidate-vetting',
                    text: candidateQuery.updateCandidateVetting,
                    values: [candidateId, vettingStatus, _body.employeeId, currentTime],
                }

                await client.query(updateQuery);
                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate Vetting Updated successfully", data: {} });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Function to remove a candidate from a position by admin and sending a notification email to the provider who added this candidate.
export const removeCandidateFromPosition = (_body) => {
    return new Promise((resolve, reject) => {
        var jobReceivedId;
        var candidateFirstName;
        var candidateLastName;
        var message;
        var positionName;
        var hirerName;
        (async () => {
            const client = await database().connect()
            try {
                var candidateId = _body.candidateId;
                var positionId = _body.positionId;
                await client.query('BEGIN');
                // Query to change the status of a candidate to false.
                const removeCandidateQuery = {
                    name: 'delete-candidate-from-position',
                    text: candidateQuery.deleteCandidateFromPosition,
                    values: [candidateId, positionId],
                }
                await client.query(removeCandidateQuery);
                const removeFromCandidateClientHiringStep = {
                    name: 'delete-candidate-from-clienthiringstep',
                    text: candidateQuery.deleteCandidateFromCandidateClientHiringStep,
                    values: [candidateId, positionId],
                }
                await client.query(removeFromCandidateClientHiringStep);
                // Retreving the details of the candidate to add to the mail
                const getPositionDetails = {
                    name: 'delete-position-details',
                    text: candidateQuery.getPositionDetails,
                    values: [positionId],
                }
                var positionDetail = await client.query(getPositionDetails);
                positionName = positionDetail.rows[0].positionName
                hirerName = positionDetail.rows[0].hirerName


                // query to retrieve the provider's(seller's) email address.
                const getSellerEmailQuery = {
                    name: 'get-email-details',
                    text: candidateQuery.getSellerMail,
                    values: [candidateId],
                }
                var emailResults = await client.query(getSellerEmailQuery);
                candidateFirstName = emailResults.rows[0].cFirstName
                candidateLastName = emailResults.rows[0].cLastName
                var sellerMail = emailResults.rows[0].email
                var subject = "Candidate Removal Notification";
                let imageResults = await client.query(queryService.getImageDetails(_body))
                message = `${candidateFirstName + ' ' + candidateLastName} who had applied for the position ${positionName} has been removed `
                let path = 'src/emailTemplates/candidateDeletionMailText.html';
                let replacements = {
                    position: positionName,
                    name1: candidateFirstName,
                    name2: candidateLastName
                };
                if(sellerMail!=null || '' || undefined)
                        {
                            emailClient.emailManager(sellerMail, subject, path, replacements);
                        }
                        else
                        {
                            console.log("Email Recipient is empty")
                        } 
                let resourceAllocatedRecruiter = await client.query(queryService.getResourceAllocatedRecruiter(_body));
                var positions = await client.query(queryService.getPositionName(_body));
                if(resourceAllocatedRecruiter.rows[0].email!=null || '' || undefined)
                {
                    emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email, subject, path, replacements);
                }
                else
                {
                    console.log("Email Recipient is empty")
                } 
                if(positions.rows[0].email!=null || '' || undefined)
                {
                    emailClient.emailManager(positions.rows[0].email, subject, path, replacements);
                }
                else
                {
                    console.log("Email Recipient is empty")
                } 
                await client.query('COMMIT')
                await createNotification({ positionId, jobReceivedId, companyId: _body.companyId, message, candidateId, notificationType: 'candidateChange', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: imageResults.rows[0].image, firstName: imageResults.rows[0].candidate_first_name, lastName: imageResults.rows[0].candidate_last_name })
                resolve({ code: 200, message: "Candidate deleted successfully", data: { positionId: positionId } });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>> Link the candidates to a particular position .
export const linkCandidateWithPosition = (_body) => {
    return new Promise((resolve, reject) => {
        let nameList = [];
        (async () => {

            const client = await database().connect()
            try {
                await client.query('BEGIN');
                let promise = [];
                const candidateList = _body.candidates;
                const positionId = _body.positionId;
                let positionName = '';
                let hirerName = '';
                let count = 0
                var names = '';
                var n=[]
                var firstName;
                var lastName
                var index;
                const currentTime = Math.floor(Date.now());
                const getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: candidateQuery.getellowAdmins,
                    values: []


                }
                var ellowAdmins = await client.query(getEllowAdmins)
                // Get position realted details
                const getPositionNames = {
                    name: 'get-position-details',
                    text: candidateQuery.getPositionDetails,
                    values: [_body.positionId],
                }
                var positionResult = await client.query(getPositionNames);
                positionName = positionResult.rows[0].positionName
                hirerName = positionResult.rows[0].hirerName
                var positionCompanyId = positionResult.rows[0].companyId
                var jobReceivedId = positionResult.rows[0].jobReceivedId

                // Inserting candidates to candidate_positions table
                if (_body.userRoleId == 1) {
                    candidateList.forEach(element => {
                        const linkCandidateByAdminQuery = {
                            name: 'link-candidate-with-position',
                            text: candidateQuery.linkCandidateWithPositionByAdmin,
                            values: [positionId, element.candidateId, _body.employeeId, currentTime, element.ellowRate, element.currencyTypeId, element.billingTypeId, element.adminComment, 1],
                        }
                        count = count + 1
                        promise.push(client.query(linkCandidateByAdminQuery));
                    });
                    await Promise.all(promise);
                }
                else {
                    candidateList.forEach(element => {
                        const linkCandidateQuery = {
                            name: 'link-candidate-with-position',
                            text: candidateQuery.linkCandidateWithPosition,
                            values: [positionId, element.candidateId, _body.employeeId, currentTime],
                        }
                        count = count + 1
                        promise.push(client.query(linkCandidateQuery));

                    });
                    await Promise.all(promise);
                }




                // Sending notification to ellow recuiter for each candidate linked to a position

                // candidateList.forEach(async element => {
                for (const element of candidateList) {

                    let imageResults = await client.query(queryService.getImageDetails(element))
                    // Adding client based hiring steps with respect to poition being linked
                    _body.candidateId = element.candidateId;
                    await client.query(queryService.addCandidateHiringSteps(_body));
                    firstName = imageResults.rows[0].candidate_first_name.charAt(0).toUpperCase() + imageResults.rows[0].candidate_first_name.slice(1)
                    lastName = imageResults.rows[0].candidate_last_name.charAt(0).toUpperCase() + imageResults.rows[0].candidate_last_name.slice(1)
                    names = names = names+ `${firstName} ${lastName} \n`
                    var email = imageResults.rows[0].email_address
                    let replacements = {
                        name: firstName,
                        positionName: positionName
                    };
                    let path = 'src/emailTemplates/addCandidatesUsersText.html';
                    if(email!=null || '' || undefined)
                    {
                        emailClient.emailManager(email, config.text.addCandidatesUsersTextSubject, path, replacements);
                    }
                    else
                    {
                        console.log("Email Recipient is empty")
                    } 
                }
                // });                     
                await client.query('COMMIT')
                let message = `${count} candidates has been added for the position ${positionName}`
                createHirerNotifications({ positionId: _body.positionId, jobReceivedId: jobReceivedId, companyId: positionCompanyId, message: message, candidateId: null, notificationType: 'candidateList', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: null, firstName: null, lastName: null })
                createNotification({ positionId: _body.positionId, jobReceivedId: jobReceivedId, companyId: _body.companyId, message: message, candidateId: null, notificationType: 'candidateList', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: null, firstName: null, lastName: null })
              
                if (Array.isArray(ellowAdmins.rows)) {
                    let replacements = {
                        positionName: positionName,
                        candidateNames: names
                    };
                    let path = 'src/emailTemplates/addCandidatesText.html';
                    ellowAdmins.rows.forEach(element => {
                        if(element.email!=null || '' || undefined)
                        {
                            emailClient.emailManager(element.email, config.text.addCandidatesTextSubject, path, replacements);
                        }
                        else
                        {
                            console.log("Email Recipient is empty")
                        } 
                    })
                }

                resolve({ code: 200, message: "Candidate added to position successfully", data: {} });
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
//>>>>>>>> Update resume file name
export const modifyResumeFile = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                if (_body.candidateId!=null) {
                    await client.query(queryService.updateResumeFile(_body));
                    resolve({ code: 200, message: "Candidate resume file updated successfully", data: {} });
                }
                else {
                    var results = await client.query(queryService.updateResumeForNewEntry(_body));
                    resolve({ code: 200, message: "Candidate resume file updated successfully", data: { candidateId: results.rows[0].candidate_id } });
                }

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Update resume file name
export const modifyResumeData = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let extractedData = rchilliExtractor.rchilliExtractor(_body), candidateId = null;
                extractedData["employeeId"] = _body.employeeId;
                extractedData["resume"] = _body.resume;
                extractedData["candidateId"]=_body.candidateId;
                if (_body.candidateId) {
                    await client.query(queryService.updateExtractedCandidateDetails(extractedData));
                    candidateId = _body.candidateId;
                }

                else {
                    let freelancer = await client.query(queryService.getFreelancerCompany(_body))
                    extractedData["freelancerCompanyId"] = freelancer.rows[0].company_id

                    let candidateResult = await client.query(queryService.insertExtractedCandidateDetails(extractedData));
                    console.log(candidateResult)
                    if ([null, undefined, ''].includes(candidateResult) || [null, undefined, ''].includes(candidateResult.rows[0])) {
                        console.log("error resume already uploaded");
                        return reject({ code: 400, message: "This resume is already uploaded/extracted use another resume", data: {} });
                    }

                    candidateId = candidateResult.rows[0].candidate_id;

                }

                await client.query('COMMIT');
                try {
                    let promises = [];

                    extractedData["candidateId"] = candidateId;
                    await client.query(queryService.insertExtractedCandidateSkills(extractedData));


                    extractedData["workHistory"].map((data) => {
                        data["candidateId"] = candidateId;
                        data["employeeId"] = _body.employeeId;
                        promises.push(client.query(queryService.insertCandidateWorkHistoryQuery(data)));
                    });

                    await Promise.all(promises);

                    promises = [];
                    extractedData["projects"].map((data) => {
                        data["candidateId"] = candidateId;
                        data["employeeId"] = _body.employeeId;
                        promises.push(client.query(queryService.insertExtractedCandidateProjectsQuery(data)));
                    });

                    await Promise.all(promises);

                    promises = [];
                    extractedData["education"].map((data) => {
                        data["candidateId"] = candidateId;
                        data["employeeId"] = _body.employeeId;
                        promises.push(client.query(queryService.insertCandidateEducationQuery(data)));
                    });

                    await Promise.all(promises);

                    promises = [];
                    extractedData["certifications"].map((data) => {
                        data["candidateId"] = candidateId;
                        data["employeeId"] = _body.employeeId;
                        promises.push(client.query(queryService.insertCandidateAwardQuery(data)));
                    });

                    await Promise.all(promises);

                    promises = [];
                    extractedData["publications"].map((data) => {
                        data["candidateId"] = candidateId;
                        data["employeeId"] = _body.employeeId;
                        promises.push(client.query(queryService.insertCandidatePublicationQuery(data)));
                    });

                    await Promise.all(promises);

                    promises = [];
                    extractedData["socialProfile"].map((data) => {
                        data["candidateId"] = candidateId;
                        data["employeeId"] = _body.employeeId;
                        utils.stringEquals(data.title, 'github') ? _body.githubId = data.link :
                            utils.stringEquals(data.title, 'Linkedin') ? _body.linkedinId = data.link :
                                utils.stringEquals(data.title, 'Stackoverflow') ? _body.stackoverflowId = data.link : '';
                    });
                    _body.candidateId = candidateId
                    await client.query(queryService.insertCandidateSocialProfile(_body));
                    await client.query(queryService.insertExtractedLanguagesQuery(extractedData));
                    await client.query('COMMIT');

                    return resolve({ code: 200, message: "Candidate resume file updated successfully", data: candidateId });

                } catch (error) {
                    console.log("error : ", error.message);
                    reject({ code: 400, message: "Error occured during extraction ", data: error.message });
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



// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Function to update the candidate's profile details
export const modifyProfileDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query(queryService.modifyCandidateProfileDetailsQuery(_body));
                resolve({ code: 200, message: "Candidate ProfileDetails updated successfully", data: {} });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again ", data: e.message })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Update candidate availability 
export const modifyCandidateAvailability = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query(queryService.modifyCandidateAvailabilityQuery(_body));
                resolve({ code: 200, message: "Candidate availability updated successfully", data: {} });
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
// >>>>>>>>>>> Function to add or update a candidate's language proficiency.
// Checks if the action is add or update.
export const modifyLanguageProficiency = (_body) => {
    return new Promise((resolve, reject) => {
        var candidateLanguageId;
        (async () => {
            const client = await database().connect()
            _body.proficiency = utils.emptyStringCheck(_body.proficiency)
            try {
                switch (_body.action) {
                    case 'add':
                        var results = await client.query(queryService.insertLanguageProficiencyQuery(_body));
                        candidateLanguageId = results.rows[0].candidate_language_id
                        break;

                    case 'update':
                    case ![null, undefined, ''].includes(_body.candidateLanguageId):
                        await client.query(queryService.modifyLanguageProficiencyQuery(_body));
                        candidateLanguageId = _body.candidateLanguageId
                        break;

                    case 'delete':
                    case ![null, undefined, ''].includes(_body.candidateLanguageId):
                        await client.query(queryService.deleteLanguageProficiencyQuery(_body));
                        candidateLanguageId = _body.candidateLanguageId

                        break;

                    default:
                        reject({ code: 400, message: "Invalid candidateLanguageId or action ", data: {} });
                }
                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate Language updated successfully", data: { candidateLanguageId: candidateLanguageId } });
            } catch (e) {
                console.log("error caught : ", e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("error caught 2 : ", e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Add work experience of the candidate
export const addWorkExperience = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                _body.remoteWorkExperience === "" ? null : _body.remoteWorkExperience
                await client.query(queryService.addWorkExperiences(_body));
                resolve({ code: 200, message: "Candidate overall work experience updated successfully", data: {} });
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
// >>>>>>>>>>>>>> Insert,update or delete projects done by the candidate.
export const modifyCandidateProject = (_body) => {
    return new Promise((resolve, reject) => {
        var candidateProjectId;
        (async () => {
            const client = await database().connect()
            try {
                switch (_body.action) {
                    case 'add':
                        _body.skills = JSON.stringify(_body.skills)
                        var results = await client.query(queryService.insertCandidateProjectsQuery(_body));
                        candidateProjectId = results.rows[0].candidate_project_id
                        break;

                    case 'update':
                    case ![null, undefined, ''].includes(_body.candidateProjectId):
                        _body.skills = JSON.stringify(_body.skills)
                        await client.query(queryService.modifyCandidateProjectsQuery(_body));
                        candidateProjectId = _body.candidateProjectId
                        break;

                    case 'delete':
                    case ![null, undefined, ''].includes(_body.candidateProjectId):
                        await client.query(queryService.deleteCandidateProjectsQuery(_body));
                        candidateProjectId = _body.candidateProjectId
                        break;

                    default:
                        reject({ code: 400, message: "Invalid candidateProjectId or action ", data: {} });
                }

                resolve({ code: 200, message: "Candidate project updated successfully", data: { candidateProjectId: candidateProjectId } });

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
//>>>>>>>> Update candidate's work history
export const modifyCandidateWorkHistory = (_body) => {
    return new Promise((resolve, reject) => {
        var candidateWorExperienceId;
        (async () => {
            const client = await database().connect()
            _body.startDate = utils.emptyStringCheck(_body.startDate)
            _body.endDate = utils.emptyStringCheck(_body.endDate)
            console.log("START DATE", _body.startDate)
            console.log("END DATE", _body.startDate)
            try {
                switch (_body.action) {
                    case 'add':
                        var results = await client.query(queryService.insertCandidateWorkHistoryQuery(_body));
                        candidateWorExperienceId = results.rows[0].candidate_work_experience_id
                        break;

                    case 'update':
                    case ![null, undefined, ''].includes(_body.candidateWorkExperienceId):
                        await client.query(queryService.modifyCandidateWorkHistoryQuery(_body));
                        candidateWorExperienceId = _body.candidateWorkExperienceId
                        break;

                    case 'delete':
                    case ![null, undefined, ''].includes(_body.candidateWorkExperienceId):
                        await client.query(queryService.deleteCandidateWorkHistoryQuery(_body));
                        candidateWorExperienceId = _body.candidateWorkExperienceId
                        break;

                    default:
                        reject({ code: 400, message: "Invalid candidateWorkExperienceId or action ", data: {} });
                }
                resolve({ code: 200, message: "Candidate work history updated successfully", data: { candidateWorExperienceId: candidateWorExperienceId } });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Insert,update or delete educational qualifications of candidate
export const modifyEducation = (_body) => {
    return new Promise((resolve, reject) => {
        var candidateEducationId;
        (async () => {
            const client = await database().connect()
            try {
                switch (_body.action) {
                    case 'add':
                        var results = await client.query(queryService.insertCandidateEducationQuery(_body));
                        candidateEducationId = results.rows[0].candidate_education_id
                        break;

                    case 'update':
                    case ![null, undefined, ''].includes(_body.candidateEducationId):
                        await client.query(queryService.modifyCandidateEducationQuery(_body));
                        candidateEducationId = _body.candidateEducationId
                        break;

                    case 'delete':
                    case ![null, undefined, ''].includes(_body.candidateEducationId):
                        await client.query(queryService.deleteCandidateEducationQuery(_body));
                        candidateEducationId = _body.candidateEducationId
                        break;

                    default:
                        reject({ code: 400, message: "Invalid candidateEducationId or action ", data: {} });
                }

                resolve({ code: 200, message: "Candidate education updated successfully", data: { candidateEducationId: candidateEducationId } });

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
// >>>>>>>>>>>>> Update cloud proficiencies acheived by the candidate
export const modifyCloudProficiency = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                _body.idSet = Array.isArray(_body.cloudProficiency) ? _body.cloudProficiency.map(a => a.cloudProficiencyId).filter(Number) : false;
                if (_body.idSet) {
                    await client.query(queryService.deleteCandidateCloudQuery(_body));
                    await client.query(queryService.insertCandidateCloudQuery(_body));
                }

                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate cloud proficiency updated successfully", data: {} });
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
// >>>>>>>>>>>>> Update social media links of the candidate
export const modifySocialPresence = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query(queryService.insertCandidateSocialQuery(_body));

                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate social profile updated successfully", data: {} });
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
// >>>>>>>>>>>>> Update any publications done by the candidate
export const modifyPublication = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        var candidatePublicationId;
        (async () => {
            const client = await database().connect()
            _body.publishedYear = utils.emptyStringCheck(_body.publishedYear)
            try {
                switch (_body.action) {
                    case 'add':
                        var results = await client.query(queryService.insertCandidatePublicationQuery(_body));
                        candidatePublicationId = results.rows[0].candidate_publication_id
                        break;

                    case 'update':
                    case ![null, undefined, ''].includes(_body.candidatePublicationId):
                        await client.query(queryService.modifyCandidatePublicationQuery(_body));
                        candidatePublicationId = _body.candidatePublicationId
                        break;

                    case 'delete':
                    case ![null, undefined, ''].includes(_body.candidatePublicationId):
                        await client.query(queryService.deleteCandidatePublicationQuery(_body));
                        candidatePublicationId = _body.candidatePublicationId
                        break;

                    default:
                        reject({ code: 400, message: "Invalid candidatePublicationId or action ", data: {} });
                }
                resolve({ code: 200, message: "Candidate Publication updated successfully", data: { candidatePublicationId: candidatePublicationId } });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Update any awards acheived by the candidate
export const modifyAward = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            _body.certifiedYear = utils.emptyStringCheck(_body.certifiedYear)
            console.log(_body.certifiedYear)
            try {
                switch (_body.action) {
                    case 'add':
                        await client.query(queryService.insertCandidateAwardQuery(_body));
                        break;

                    case 'update':
                    case ![null, undefined, ''].includes(_body.candidateAwardId):
                        await client.query(queryService.modifyCandidateAwardQuery(_body));
                        break;

                    case 'delete':
                    case ![null, undefined, ''].includes(_body.candidateAwardId):
                        await client.query(queryService.deleteCandidateAwardQuery(_body));
                        break;

                    default:
                        reject({ code: 400, message: "Invalid candidateAwardId or action ", data: {} });
                }

                resolve({ code: 200, message: "Candidate Award updated successfully", data: {} });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("E", e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}

export const modifySkill = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                switch (_body.action) {
                    case 'add':
                        _body.skillId = ![null, undefined, ''].includes(_body.skill) ? _body.skill.skillId : null;
                        await client.query(queryService.insertCandidateSkillQuery(_body));
                        break;

                    case 'update':
                    case ![null, undefined, ''].includes(_body.candidateSkillId):
                        _body.skillId = ![null, undefined, ''].includes(_body.skill) ? _body.skill.skillId : null;
                        await client.query(queryService.modifyCandidateSkillQuery(_body));
                        break;

                    case 'delete':
                    case ![null, undefined, ''].includes(_body.candidateSkillId):
                        _body.skillId = ![null, undefined, ''].includes(_body.skill) ? _body.skill.skillId : null;
                        await client.query(queryService.deleteCandidateSkillQuery(_body));
                        break;

                    default:
                        reject({ code: 400, message: "Invalid candidateSkillId or action ", data: {} });
                }

                resolve({ code: 200, message: "Candidate Skill updated successfully", data: {} });

            } catch (e) {
                console.log('Error 1 : ', e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
            }
        })().catch(e => {
            console.log('Error 2 : ', e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Fetch resume details about the candidate.  ( Resume Page)
export const getResume = (_body) => {
    return new Promise((resolve, reject) => {
        const candidateId = _body.candidateId;

        var projectArray = [];
        var assesmentArray = []
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');

                var allProfileDetails = await client.query(queryService.fetchProfile(candidateId));
                var skills = await client.query(queryService.fetchSkills(candidateId));
                var projects = await client.query(queryService.fetchProjects(candidateId));
                // var assesements=await client.query(queryService.fetchAssesements(candidateId));
                var workExperiences = await client.query(queryService.fetchWorkExperience(candidateId));
                var educations = await client.query(queryService.fetchEducations(candidateId));
                var socialProfileDetails = await client.query(queryService.fetchSocialProfile(candidateId));
                var cloudProficiencyDetails = await client.query(queryService.fetchCloudProficiency(candidateId));
                var publications = await client.query(queryService.fetchPublications(candidateId));
                var awards = await client.query(queryService.fetchAwards(candidateId));
                var languages = await client.query(queryService.fetchLanguages(candidateId));
                var designations = await client.query(queryService.fetchDesignations());

                let workedCompanyList = workExperiences.rows.map(element => ({ "id": element.candidateWorkExperienceId, "companyName": element.companyName }))
                workedCompanyList = [...workedCompanyList, { "id": 0, "companyName": "On personal capacity" }];
                let companyJson = {};
                companyJson = Object.assign({ 0: 'On personal capacity' }, companyJson);
                workExperiences.rows.forEach(element => { companyJson[element.candidateWorkExperienceId] = element.companyName });

                if (Array.isArray(projects.rows)) {
                    projects.rows.forEach(element => {
                        projectArray.push({
                            candidateProjectId: element.candidateProjectId,
                            candidateId: element.candidateId,
                            projectName: element.projectName,
                            clientName: element.clientName,
                            yearsOfExperience: element.yoe,
                            projectDescription: element.projectDescription,
                            projectLink: element.projectLink,
                            contribution: element.contribution,
                            doneFor: element.doneFor,
                            doneForName: companyJson[element.doneFor],
                            role: element.role,
                            skills: JSON.parse(element.skills),
                            extraProject: element.extraProject
                        })
                    });
                }

                let citizenship = allProfileDetails.rows[0].citizenship;
                let citizenshipName = ![null, undefined, ""].includes(citizenship) ? config.countries.filter(element => element.id == citizenship)[0].name : '';
                let residence = allProfileDetails.rows[0].residence;

                let profileDetails = {
                    firstName: allProfileDetails.rows[0].firstName,
                    lastName: allProfileDetails.rows[0].lastName,
                    candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
                    description: allProfileDetails.rows[0].description,
                    candidateStatus: allProfileDetails.rows[0].candidateStatus,
                    sellerCompanyId: allProfileDetails.rows[0].sellerCompanyId,
                    image: allProfileDetails.rows[0].image,
                    citizenship,
                    citizenshipName,
                    residence,
                    phoneNumber: allProfileDetails.rows[0].phoneNumber,
                    email: allProfileDetails.rows[0].email,
                    candidateVetted: allProfileDetails.rows[0].candidateVetted,
                    blacklisted: allProfileDetails.rows[0].blacklisted,
                }

                let overallWorkExperience = {
                    cost: allProfileDetails.rows[0].rate,
                    ellowRate: allProfileDetails.rows[0].ellowRate,
                    workExperience: allProfileDetails.rows[0].workExperience,
                    remoteWorkExperience: allProfileDetails.rows[0].remoteWorkExperience,
                    billingTypeId: allProfileDetails.rows[0].billingTypeId,
                    currencyTypeId: allProfileDetails.rows[0].currencyTypeId,
                    candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
                }
                let availability = {
                    availability: allProfileDetails.rows[0].availability,
                    typeOfAvailability: allProfileDetails.rows[0].typeOfAvailability,
                    readyToStart: allProfileDetails.rows[0].readyToStart
                }
                await client.query('COMMIT')
                resolve({
                    code: 200, message: "Resume listed successfully",
                    data:
                    {
                        candidateId: Number(_body.candidateId),
                        profile: profileDetails,
                        detailResume: utils.JsonStringParse(allProfileDetails.rows[0].detailResume),
                        htmlResume: allProfileDetails.rows[0].htmlResume,
                        bagOfWords : allProfileDetails.rows[0].bagOfWords,
                        resume: allProfileDetails.rows[0].resume,
                        overallWorkExperience,
                        availability,
                        socialPresence: socialProfileDetails.rows[0],
                        candidateCloudProficiency: cloudProficiencyDetails.rows,
                        skills: skills.rows,
                        projects: projectArray,
                        assesments: assesmentArray,
                        workExperience: workExperiences.rows,
                        education: educations.rows,
                        publications: publications.rows,
                        awards: awards.rows,
                        languages: languages.rows,
                        workedCompanyList,
                        designationList: designations.rows[0].designations
                    }
                });

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
                                if(element!=null || '' || undefined)
                                {
                                    emailClient.emailManagerForNoReply(element, config.text.shareEmailSubject, path, replacements);
                                }
                                else
                                {
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

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Fetch shared emails for resume
export const getSharedEmails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                if (!isNaN(_body.candidateId)) {
                    let result = await client.query(queryService.getSharedEmails(_body));
                    let sharedEmails = [undefined, null].includes(result.rows[0]) ? [] : result.rows[0].sharedEmails;
                    resolve({ code: 200, message: "Candidate shared emails retrieved", data: sharedEmails });
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
                        if(_body.email!=null || '' || undefined)
                                {
                                    emailClient.emailManager(_body.email, config.text.newUserTextSubject, path, replacements);
                                }
                                else
                                {
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
                                if(element.email!=null || '' || undefined)
                                {
                                    emailClient.emailManager(element.email, config.text.newUserAdminTextSubject, adminPath, adminReplacements);
                                }
                                else
                                {
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

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Get the details in a candidate's resume
export const fetchResumeData = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                let result = await client.query(queryService.getCandidateId(_body));
                if (result.rows[0]) {
                    let emailResult = await client.query(queryService.getEmailFromEmployeeId(_body));


                    if (result.rows[0].shared_emails.includes(emailResult.rows[0].email)) {
                        let candidateId = result.rows[0].candidate_id;
                        _body.candidateId = candidateId;
                        let data = await getResume(_body);
                        delete data["data"].assesmentLink;
                        delete data["data"].assesementComment;
                        delete data["data"].assesments;

                        resolve({ code: 200, message: "Candidate resume listed successfully", data: data["data"] });
                    }
                    else {
                        reject({ code: 400, message: "You do not have access to this content", data: {} });
                    }
                }
                else {
                    reject({ code: 400, message: "Token expired or does not exist", data: {} });
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

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Get initial details of a candidate's resume
export const initialSharedResumeData = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                let result = await client.query(queryService.getCandidateId(_body));
                if (result.rows[0]) {
                    let candidateId = result.rows[0].candidate_id;
                    _body.candidateId = candidateId;

                    var allProfileDetails = await client.query(queryService.fetchProfile(candidateId));
                    var skills = await client.query(queryService.fetchSkills(candidateId));
                    let citizenship = allProfileDetails.rows[0].citizenship;
                    let citizenshipName = ![null, undefined, ""].includes(citizenship) ? config.countries.filter(element => element.id == citizenship)[0].name : '';
                    let residence = allProfileDetails.rows[0].residence;

                    let profileDetails = {
                        firstName: allProfileDetails.rows[0].firstName,
                        lastName: allProfileDetails.rows[0].lastName,
                        candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
                        description: allProfileDetails.rows[0].description,
                        candidateStatus: allProfileDetails.rows[0].candidateStatus,
                        sellerCompanyId: allProfileDetails.rows[0].sellerCompanyId,
                        image: allProfileDetails.rows[0].image,
                        citizenship,
                        citizenshipName,
                        residence,
                        phoneNumber: allProfileDetails.rows[0].phoneNumber,
                        email: allProfileDetails.rows[0].email,
                        candidateVetted: allProfileDetails.rows[0].candidateVetted
                    }

                    let overallWorkExperience = {
                        cost: allProfileDetails.rows[0].rate,
                        ellowRate: allProfileDetails.rows[0].ellowRate,
                        workExperience: allProfileDetails.rows[0].workExperience,
                        remoteWorkExperience: allProfileDetails.rows[0].remoteWorkExperience,
                        billingTypeId: allProfileDetails.rows[0].billingTypeId,
                        currencyTypeId: allProfileDetails.rows[0].currencyTypeId,
                        candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
                    }
                    let availability = {
                        availability: allProfileDetails.rows[0].availability,
                        typeOfAvailability: allProfileDetails.rows[0].typeOfAvailability,
                        readyToStart: allProfileDetails.rows[0].readyToStart
                    }
                    await client.query('COMMIT')
                    resolve({
                        code: 200, message: "Initial Resume data listed successfully",
                        data:
                        {
                            candidateId: Number(_body.candidateId),
                            profile: profileDetails,
                            resume: allProfileDetails.rows[0].resume,
                            overallWorkExperience,
                            availability,
                            skills: skills.rows
                        }
                    });
                }
                else {
                    reject({ code: 400, message: "Token expired or does not exist", data: {} });
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
                            if(element!=null || '' || undefined)
                            {
                                emailClient.emailManagerWithAttachments(element, config.text.sharePdfTextSubject, path, replacements, pdfBuffer);
                            }
                            else
                            {
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
export const fetchResumeDataForPdf = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {

                if (myCache.has(_body.uniqueId)) {
                    let candidateId = myCache.take(_body.uniqueId);
                    _body.candidateId = candidateId;
                    let data = await getResume(_body);
                    delete data["data"].assesmentLink;
                    delete data["data"].assesementComment;
                    delete data["data"].assesments;
                    resolve({ code: 200, message: "Candidate resume shared data fetched successfully", data: data["data"] });

                }
                else {
                    reject({ code: 400, message: "UniqueId expired or does not exist", data: {} });
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
                let query3 = await client.query(queryService.adminSignup(_body));
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
                if(assigneeMail!=null || '' || undefined)
                {
                    emailClient.emailManager(assigneeMail, subject, path, replacements);
                }
                else
                {
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
                        if(element.email!=null || '' || undefined)
                        {
                            emailClient.emailManager(element.email, _body.subject, _body.path, _body.adminReplacements);
                        }
                        else
                        {
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
// Extract resume data and parse content from response
export const resumeParser = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                let responseData = null;
                console.log("Start")
                console.log("URI : ", _body.publicUrl + encodeURIComponent(_body.fileName));
                console.log(_body.fileName)
                let jsonObject = JSON.stringify({
                    "url": _body.publicUrl + encodeURIComponent(_body.fileName),
                    "userkey": "IC8Q6BQ5",
                    "version": "8.0.0",
                    "subuserid": "Deena Sasidhar"
                });

                // prepare the header
                var postheaders = {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
                };

                // the post options
                var optionspost = {
                    host: 'rest.rchilli.com',
                    port: 80,
                    path: '/RChilliParser/Rchilli/parseResume',
                    method: 'POST',
                    headers: postheaders
                };

                console.info('Options prepared:');
                console.info(optionspost);
                console.info('Do the POST call');

                // do the POST call
                var reqPost = https.request(optionspost, function (res) {
                    // uncomment it for header details
                    //  console.log("headers: ", res.headers);
                    let data = '';
                    res.on('data', function (d) {
                        console.info('POST result:\n');
                        data += d;
                        console.info('\n\nPOST completed');
                    });

                    res.on('end', async () => {

                        // process.stdout.write(data);
                        responseData = JSON.parse(data);

                        if (responseData["error"] !== undefined)
                            reject({ code: 400, message: "Failed Please try again, parser error ", data: responseData["error"] });

                        else {
                            responseData["employeeId"] = _body.employeeId;
                            responseData["resume"] = _body.fileName;
                            responseData["candidateId"] = _body.candidateId
                            responseData["ResumeParserData"]["ResumeFileName"] = _body.fileName.substring(36);
                            let resp = await modifyResumeData(responseData).catch((e) => {
                                reject({ code: 400, message: "Failed Please try again, parser error ", data: e.message });
                            });
                            resolve({ code: 200, message: "Resume parsed successfully", data: { candidateId: resp["data"] } });

                        }
                    });

                }).on("error", (err) => {
                    console.log("Error: ", err.message);
                    reject({ code: 400, message: "Error from parser", data: err.message });
                });

                // write the json data
                reqPost.write(jsonObject);
                reqPost.end();
                reqPost.on('error', function (e) {
                    // console.error(e);                        
                    responseData = e.message;
                });


                await client.query('COMMIT');


            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again ", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again", data: e.message })
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

export const getHtmlResume = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let bow = [], promises = [];
                // Inserting the integer representing the vetting status value.
                const getQuery = {
                    name: 'get-resume-data',
                    text: candidateQuery.getResumeData,
                    values: [],
                }
                var results = await client.query(getQuery);
                const data = results.rows


                const regex = /^[^a-zA-Z0-9]+$/;


                data.forEach(async element => {
                    try {
                        
                        let d = JSON.parse(element['resume_data']);
                        let res = d["ResumeParserData"]["DetailResume"];    
                        res = res.replace(/[^a-zA-Z\n@. ]/g, '');
                        res = res.split(/[\s\n]+/);
                        let uniqueChars = [...Array.from(new Set(res.sort()))];
                        
                        let filterUniqueChars = uniqueChars.filter((ele:string)=> !regex.test(ele))
        
                        let updateQuery = {
                            name: 'update-bagofwords-details',
                            text: candidateQuery.updateHtmlResume,
                            values: [filterUniqueChars,element.candidate_id]
                        }
        
                        await client.query(updateQuery);
                        await client.query('COMMIT');

                    } catch (error) {
                        console.log("unable to parse : ",error.message);
                        
                    }
                   
                });
                console.log("Done ");

                // await Promise.all(promises);
                resolve({ code: 200, message: "resume data fetched", data: 'done' })

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
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