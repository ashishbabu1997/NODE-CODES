import candidateQuery from './query/candidates.query';
import database from '../common/database/database';
import { sendMail } from '../middlewares/mailer'
import config from '../config/config';
import { createNotification } from '../common/notifications/notifications';
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import {nanoid} from 'nanoid';

export const getCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                let skills =[]
                await client.query('BEGIN');
                const listCandidateQuery = {
                    name: 'get-candidate-details',
                    text: candidateQuery.getCandidateDetails,
                    values: [_body.candidateId],
                }
                let results = await client.query(listCandidateQuery);
                const candidate = results.rows;
                const positionId = candidate[0].positionId
                const getCandidateAssessmentTraitsQuery = {
                    name: 'get-candidate-assessmentTraits',
                    text: candidateQuery.getAssessmentTraits,
                    values: [_body.candidateId],
                }
                let value = await client.query(getCandidateAssessmentTraitsQuery);
                
                let assessmentTraits = value.rows
                if (_body.admin != 1 && Array.isArray(assessmentTraits) && assessmentTraits.length >= 0) {
                    let flag = false;
                    assessmentTraits.forEach(element => {
                        element.adminRating != null && element.adminRating > 0 ? flag = true : "";
                    });
                    if (!flag) {
                        assessmentTraits = null;
                    }
                    
                }
                const getCandidateSkillsQuery = {
                    name: 'get-candidate-skills',
                    text: candidateQuery.getCandidateSkills,
                    values: [_body.candidateId],
                }
                let skillResult = await client.query(getCandidateSkillsQuery);
                skillResult.rows.forEach(step => {
                    if (step.skillId != null) {
                        skills.push(
                            {
                                skill:{
                                    skillId: step.skillId,
                                    skillName: step.skillName
                                },
                                competency:step.competency,
                                yoe:step.yoe,
                                preferred:step.preferred
                            }
                            )
                        }
                    });
                    let result = {
                        makeOffer: candidate[0].makeOffer,
                        adminApproveStatus: candidate[0].adminApproveStatus,
                        firstName: candidate[0].firstName,
                        lastName: candidate[0].lastName,
                        companyName: candidate[0].companyName,
                        companyId: candidate[0].companyId,
                        positionName: candidate[0].positionName,
                        description: candidate[0].description,
                        candidateStatus: candidate[0].candidateStatus,
                        coverNote: candidate[0].coverNote,
                        resume: candidate[0].resume,
                        rate: candidate[0].rate,
                        ellowRate: candidate[0].ellowRate,
                        billingTypeId: candidate[0].billingTypeId,
                        currencyTypeId: candidate[0].currencyTypeId,
                        phoneNumber: candidate[0].phoneNumber,
                        label: candidate[0].label,
                        email: candidate[0].email,
                        workExperience: candidate[0].workExperience,
                        assessmentComment: candidate[0].assessmentComment,
                        assessmentTraits,
                        skills
                    };
                    _body.userRoleId == 1 && (result['ellowRate'] = candidate[0].ellowRate)
                    resolve({ code: 200, message: "Candidate details listed successfully", data: result });
                    await client.query('COMMIT')
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
    export const listCandidatesDetails = (_body) => {
        return new Promise((resolve, reject) => {
            var selectQuery = candidateQuery.listCandidates;
            
            var adminApproveQuery='',queryText='', searchQuery='',queryValues={}, filterQuery='', filter=_body.body!=undefined?_body.body.filter:'',
            body=_body.query, sort = '', searchKey = '%%';
            
            const orderBy = {
                "updatedOn": 'ca.updated_on',
                "candidateFirstName": 'ca.candidate_first_name',
                "candidateLastName": 'ca.candidate_last_name',
                "rate": 'ca.rate',
                "ellowRate": 'cp.ellow_rate',
                "companyName": 'c.company_name'
            }
            
            if(filter)
            {            
                if(filter.name)
                {   
                    filterQuery=filterQuery+' AND (ca.candidate_first_name ILIKE $name OR ca.candidate_last_name ILIKE $name) '
                    queryValues = Object.assign({name:filter.candidateName})
                }
                if(filter.email)
                {
                    filterQuery=filterQuery+' AND email ILIKE $email'
                    queryValues =  Object.assign({email:filter.email},queryValues)
                }
                if(filter.minCost && filter.maxCost)
                {  
                    filterQuery=filterQuery+' AND (ca.rate BETWEEN $mincost AND $maxcost)'
                    queryValues=Object.assign({mincost:filter.minCost,maxcost:filter.maxCost},queryValues)
                }
                if(filter.minRate && filter.maxRate)
                {  
                    filterQuery=filterQuery+' AND (cp.ellow_rate BETWEEN $minrate AND $maxrate)'
                    queryValues=Object.assign({minrate:filter.minRate,maxrate:filter.maxRate},queryValues)
                }

            }
            
            if(![undefined,null,''].includes(body.filter))
            {
                searchKey='%' + body.filter + '%';
                searchQuery = " AND (ca.candidate_first_name ILIKE $searchkey OR ca.candidate_last_name ILIKE $searchkey OR c.company_name ILIKE $searchkey) "
                queryValues=Object.assign({searchkey:searchKey},queryValues)
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
                    queryText = selectQuery+adminApproveQuery+filterQuery+searchQuery+sort;
                    queryValues =  Object.assign({positionid:body.positionId,employeeid:body.employeeId},queryValues)
                    
                    const listCandidates = {
                        name: 'get-candidate-under-position',
                        text: queryText,
                        values: queryValues
                    }
                    const candidatesResult = await client.query(listCandidates);                    
                    const getJobReceivedId = {
                        name: 'get-jobreceived-id',
                        text: candidateQuery.getJobReceivedId,
                        values: [body.positionId]
                    }
                    const jobReceivedIdResult = await client.query(getJobReceivedId);                    
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Candidate Listed successfully", data: { jobReceivedId:jobReceivedIdResult.rows[0].job_received_id, allCandidates:candidatesResult.rows } });

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
    
    export const listFreeCandidatesDetails = (_body) => {
        return new Promise((resolve, reject) => {
            var selectQuery = candidateQuery.listFreeCandidates;
            var roleBasedQuery='',queryText='', searchQuery='',queryValues={}, filterQuery='', filter=_body.body!=undefined?_body.body.filter:'',
            body=_body.query, sort = '', searchKey = '%%';

            const orderBy = {
                "candidateId": 'ca.candidate_id',
                "candidateFirstName": 'ca.candidate_first_name',
                "candidatelastName": 'ca.candidate_last_name',
                "email": 'ca.email_address',
                "phoneNumber": 'ca.phone_number',
                "companyName": 'c.company_name',
                "updatedOn" : 'ca.updated_on'
            }

            if(filter)
            {            
                if(filter.name)
                {   
                    filterQuery=filterQuery+' AND (ca.candidate_first_name ILIKE $name OR ca.candidate_last_name ILIKE $name) '
                    queryValues = Object.assign({name:filter.candidateName})
                }
                if(filter.experience)
                {
                    filterQuery=filterQuery+' AND ca.work_experience = $experience'
                    queryValues =  Object.assign({experience:filter.experience},queryValues)
                }
            }
            
            if(![undefined,null,''].includes(body.filter))
            {
                searchKey='%' + body.filter + '%';
                searchQuery = " AND (ca.candidate_first_name ILIKE $searchkey OR ca.candidate_last_name ILIKE $searchkey OR c.company_name ILIKE $searchkey) "
                queryValues=Object.assign({searchkey:searchKey},queryValues)
            }

            if (body.userRoleId != 1) {
                roleBasedQuery = " AND c.company_id = $companyid"
                queryValues=Object.assign({companyid:body.companyId},queryValues)
            }
            else {
                roleBasedQuery =  " AND (ca.candidate_status = 3 or (ca.candidate_status = 4 and ca.created_by= $employeeid))" 
                queryValues=Object.assign({employeeid:body.employeeId},queryValues)
            }
            
            if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
                sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;                
            }

            (async () => {
                const client = await database()
                try {
                    await client.query('BEGIN');
                    queryText = selectQuery+roleBasedQuery+filterQuery+searchQuery+sort;
                    queryValues =  Object.assign({positionid:body.positionId,employeeid:body.employeeId},queryValues)
                
                    const listCandidates = {
                        name: 'get-free-candidates',
                        text: queryText,
                        values: queryValues
                    }
                    const candidatesResult = await client.query(listCandidates);
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Candidate Listed successfully", data: { candidates:candidatesResult.rows } });
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
    
    export const candidateClearance = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    var readHTMLFile = function (path, callback) {
                        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                            if (err) {
                                throw err;
                                callback(err);
                            }
                            else {
                                callback(null, html);
                            }
                        });
                    };
                    var adminApproveStatus;
                    var comment;
                    var subj;
                    var textFormat;
                    var candidateQueries;
                    var makeOffer;
                    var value;
                    const getCandidateName = {
                        name: 'get-candidate-names',
                        text: candidateQuery.getCandidateNames,
                        values: [_body.candidateId, _body.positionId]
                    }
                    const results = await client.query(getCandidateName);
                    const candidateDetails = results.rows[0];
                    const { firstName, lastName, jobReceivedId, companyName, positionName } = candidateDetails;
                    let message = ``
                    let candidateFirstName = firstName.fontsize(3).bold()
                    let candidateCompanyName = companyName.fontsize(3).bold()
                    if (_body.decisionValue == 1) {
                        if (_body.userRoleId == 1) {
                            adminApproveStatus = 1
                            comment = _body.comment
                            value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, _body.ellowRate, _body.employeeId, currentTime]
                            candidateQueries = candidateQuery.candidateSuperAdminApprovalQuery
                        }
                        else if (_body.userRoleId == 2) {
                            message = `${firstName + ' ' + lastName} from ${companyName} has been selected for the position:${positionName}`;
                            var approveMessage = firstName.fontsize(3).bold() + '  ' + lastName.fontsize(3).bold() + '   ' + 'from' + '   ' + companyName.fontsize(3).bold() + '   ' + 'has been selected for the position' + '   ' + positionName.fontsize(3).bold()
                            makeOffer = 1
                            adminApproveStatus = 1;
                            comment = _body.comment;
                            value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, makeOffer, _body.employeeId, currentTime]
                            candidateQueries = candidateQuery.candidateAdminApprovalQuery
                            subj = "Candidate Selection Mail";
                            readHTMLFile('src/emailTemplates/selectionMailText.html', function (err, html) {
                                var template = handlebars.compile(html);
                                var replacements = {
                                    fName: firstName,
                                    lName: lastName,
                                    cName: companyName,
                                    pName: positionName
                                };
                                var htmlToSend = template(replacements);
                                sendMail(config.adminEmail, subj, htmlToSend, function (err, data) {
                                    if (err) {
                                        console.log(err)
                                        reject({ code: 400, message: "Database Error", data: {} });
                                        return;
                                    }
                                    console.log('Admin Approval Mail has been sent !!!');
                                });
                            })
                        }
                    } else {
                        if (_body.userRoleId == 1) {
                            adminApproveStatus = 0
                            comment = _body.comment
                            value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, _body.employeeId, currentTime]
                            candidateQueries = candidateQuery.candidateSuperAdminRejectQuery
                        } else if (_body.userRoleId != 1) {
                            var rejectMessage = firstName.fontsize(3).bold() + '   ' + lastName.fontsize(3).bold() + '   ' + 'from' + '   ' + companyName.fontsize(3).bold() + '   ' + 'has been rejected for the position' + '   ' + positionName.fontsize(3).bold()
                            message = `${firstName + ' ' + lastName} from ${companyName} has been rejected for the position ${positionName}`;
                            makeOffer = 0
                            adminApproveStatus = 1;
                            comment = _body.comment;
                            value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, makeOffer, _body.employeeId, currentTime]
                            candidateQueries = candidateQuery.candidateAdminApprovalQuery
                            subj = "Candidate Rejection Mail";
                            readHTMLFile('src/emailTemplates/rejectionMailText.html', function (err, html) {
                                var template = handlebars.compile(html);
                                var replacements = {
                                    fName: firstName,
                                    lName: lastName,
                                    cName: companyName,
                                    pName: positionName
                                };
                                var htmlToSend = template(replacements);
                                sendMail(config.adminEmail, subj, htmlToSend, function (err, data) {
                                    if (err) {
                                        console.log(err)
                                        reject({ code: 400, message: "Database Error", data: {} });
                                        return;
                                    }
                                    console.log('Candidate Rejection Mail has been sent !!!');
                                });
                            })
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
                    _body.userRoleId != 1 && await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate' });
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
    
    export const interviewRequestFunction = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    var readHTMLFile = function (path, callback) {
                        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                            if (err) {
                                throw err;
                                callback(err);
                            }
                            else {
                                callback(null, html);
                            }
                        });
                    };
                    const insertQuery = {
                        name: 'insert-make-offer-status',
                        text: candidateQuery.insertMakeOfferStatus,
                        values: [_body.candidateId, _body.positionId, _body.employeeId, currentTime],
                    }
                    await client.query(insertQuery);
                    const candidateDetails = {
                        name: 'get-interview-details',
                        text: candidateQuery.getInterviewDetails,
                        values: [_body.candidateId, _body.companyId, _body.positionId],
                    }
                    const result = await client.query(candidateDetails);
                    await client.query('COMMIT');
                    var interviewDetails = result.rows
                    
                    let { jobReceivedId, candidateFirstName, candidateLastName } = interviewDetails[0];
                    
                    const message = `An interview request has been received for the candidate ${candidateFirstName + ' ' + candidateLastName}.`
                    await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate' })
                    
                    var hirerCompanyName = interviewDetails[0].hirerCompanyName.toUpperCase()
                    candidateFirstName = interviewDetails[0].candidateFirstName === null ? '' : interviewDetails[0].candidateFirstName
                    candidateLastName = interviewDetails[0].candidateLastName === null ? '' : interviewDetails[0].candidateLastName
                    var positionName = interviewDetails[0].positionName === null ? '' : interviewDetails[0].positionName
                    var email = interviewDetails[0].emailAddress === null ? '' : interviewDetails[0].emailAddress
                    var phoneNumber = interviewDetails[0].phoneNumber === null ? '' : interviewDetails[0].phoneNumber
                    // var description = interviewDetails[0].description === null ? '' : interviewDetails[0].description.fontsize(3).bold()
                    var subject = "Request for Interview from " + hirerCompanyName;
                    readHTMLFile('src/emailTemplates/interviewRequestMailText.html', function (err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                            hirerName: hirerCompanyName,
                            firstName: candidateFirstName,
                            lastName: candidateLastName,
                            position: positionName,
                            emailId: email,
                            telephoneNumber: phoneNumber
                        };
                        var htmlToSend = template(replacements);
                        sendMail(config.adminEmail, subject, htmlToSend, function (err, data) {
                            if (err) {
                                console.log(err)
                                reject({ code: 400, message: "Email Error", data: {} });
                                return;
                            }
                        });
                    })
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
    
    export const addCandidateReview = (_body) => {
        return new Promise((resolve, reject) => {
            const data = _body.assessmentTraits;
            var algorithmLink;
            var programmingLink;
            var interviewLink;
            const currentTime = Math.floor(Date.now() / 1000);
            let promise = [];
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    const insertQuery = {
                        name: 'insert-assessment-comment',
                        text: candidateQuery.updateAssessmentComment,
                        values: [_body.candidateId, _body.assessmentComment],
                    }
                    promise.push(client.query(insertQuery));
                    
                    data.forEach(element => {
                        const candidateDetails = {
                            name: 'update-candidate-assesment-rating',
                            text: candidateQuery.updateCandidateAssesment,
                            values: [element.candidateAssesmentId, element.rating, _body.employeeId, currentTime],
                        }
                        promise.push(client.query(candidateDetails));
                    });
                    if (Array.isArray(_body.assesmentLink))
                    {
                        _body.assesmentLink.forEach(element => { 
                            if (element.type == 'algorithmTestLink')
                            {
                                algorithmLink=element.link
                            }
                            else if (element.type == 'programmingTestLink')
                            {
                                programmingLink=element.link
                            }
                            else if (element.type == 'interviewLink')
                            {
                                interviewLink=element.link
                            }
                        })
                    }
                    const insertLinks = {
                        name: 'insert-assessment-links',
                        text: candidateQuery.updateAssesmentLinks,
                        values: [_body.candidateId,algorithmLink,programmingLink,interviewLink],
                    }
                    promise.push(client.query(insertLinks));
                    const results = await Promise.all(promise);
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Candidate Assesment Updated successfully", data: {} });
                    
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
    
    export const editVettingStatus = (_body) => {
        return new Promise((resolve, reject) => {
            const candidateId = _body.candidateId;
            const vettingStatus = _body.candidateVetted;
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
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
    
    
    export const removeCandidateFromPosition = (_body) => {
        return new Promise((resolve, reject) => {
            var jobReceivedId;
            var candidateFirstName;
            var candidateLastName;
            var message;
            var positionName;
            var hirerName;
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    var readHTMLFile = function (path, callback) {
                        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                            if (err) {
                                throw err;
                                callback(err);
                            }
                            else {
                                callback(null, html);
                            }
                        });
                    };
                    var candidateId = _body.candidateId;
                    var positionId = _body.positionId;
                    console.log("hai", candidateId, positionId)
                    await client.query('BEGIN');
                    const removeCandidateQuery = {
                        name: 'delete-candidate-from-position',
                        text: candidateQuery.deleteCandidateFromPosition,
                        values: [candidateId, positionId, _body.employeeId, currentTime],
                    }
                    await client.query(removeCandidateQuery);
                    const getPositionDetails = {
                        name: 'delete-position-details',
                        text: candidateQuery.getPositionDetails,
                        values: [positionId],
                    }
                    var positionDetail = await client.query(getPositionDetails);
                    positionName = positionDetail.rows[0].positionName
                    hirerName = positionDetail.rows[0].hirerName
                    const getSellerEmailQuery = {
                        name: 'get-email-details',
                        text: candidateQuery.getSellerMail,
                        values: [candidateId],
                    }
                    var emailResults = await client.query(getSellerEmailQuery);
                    candidateFirstName = emailResults.rows[0].cFirstName
                    candidateLastName = emailResults.rows[0].cLastName
                    var sellerMail = emailResults.rows[0].email
                    var subject = "Candidate Deletion Notification";
                    message = `${candidateFirstName + ' ' + candidateLastName} who had applied for the position named ${positionName} has been removed `
                    readHTMLFile('src/emailTemplates/candidateDeletionMailText.html', function (err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                            hirer: hirerName,
                            position: positionName,
                            name1: candidateFirstName,
                            name2: candidateLastName
                        };
                        var htmlToSend = template(replacements);
                        sendMail(sellerMail, subject, htmlToSend, function (err, data) {
                            if (err) {
                                console.log("mailer", err)
                                reject({ code: 400, message: "Email Error", data: {} });
                                return;
                            }
                        })
                    })
                    await client.query('COMMIT')
                    console.log(message)
                    await createNotification({ positionId, jobReceivedId, companyId: _body.companyId, message, candidateId, notificationType: 'candidateChange' })
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
    
    export const linkCandidateWithPosition = (_body) => {
        return new Promise((resolve, reject) => {
            const candidateList = _body.candidates;
            const positionId = _body.positionId;
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    let promise = [];
                    
                    candidateList.forEach(element => {
                        const linkCandidateQuery = {
                            name: 'link-candidate-with-position',
                            text: candidateQuery.linkCandidateWithPosition,
                            values: [positionId, element.candidateId, _body.employeeId, currentTime],
                        }
                        promise.push(client.query(linkCandidateQuery));
                    });
                    
                    candidateList.forEach(element => {
                        const updateSellerRate = {
                            name: 'update-seller-rate',
                            text: candidateQuery.updateSellerRate,
                            values: [element.candidateId, element.sellerFee, _body.employeeId, currentTime],
                        }
                        promise.push(client.query(updateSellerRate));
                    });
                    await Promise.all(promise);
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Candidate added to position successfully", data: {} });
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
    
    export const removeCandidate = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    const deleteCandidateQuery = {
                        name: 'delete-candidate',
                        text: candidateQuery.deleteCandidate,
                        values: [_body.candidateId, currentTime, _body.employeeId],
                    }
                    await client.query(deleteCandidateQuery);
                    
                    // await createNotification({ positionId, jobReceivedId, companyId: _body.companyId, message, candidateId, notificationType: 'candidateChange' })
                    resolve({ code: 200, message: "Candidate deleted successfully", data: {} });
                    
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
    
    export const modifyProfileDetails = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    
                    const modifyCandidateProfileDetailsQuery = {
                        name: 'modify-candidate-ProfileDetails',
                        text: candidateQuery.modifyProfileDetails,
                        values:[_body.candidateId,_body.firstName,_body.lastName,_body.description,_body.image,_body.citizenship,_body.residence,_body.phoneNumber,_body.email,currentTime,_body.employeeId,_body.candidatePositionName],
                    }
                    await client.query(modifyCandidateProfileDetailsQuery);
                    resolve({ code: 200, message: "Candidate ProfileDetails updated successfully", data: {} });
                    
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
    
    export const modifyLanguageProficiency = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    if(_body.action=='add')
                    {
                        const insertLanguageProficiencyQuery = {
                            name: 'insert-candidate-language',
                            text: candidateQuery.insertLanguageProficiency,
                            values: [_body.candidateId,_body.languageId,_body.proficiency, _body.employeeId,currentTime],
                        }
                        await client.query(insertLanguageProficiencyQuery);
                    }
                    else if(![null,undefined,''].includes(_body.candidateLanguageId) && _body.action=='update')
                    {
                        const modifyLanguageProficiencyQuery = {
                            name: 'modify-candidate-language',
                            text: candidateQuery.modifyLanguageProficiency,
                            values: [_body.candidateLanguageId,_body.candidateId,_body.languageId,_body.proficiency, currentTime, _body.employeeId],
                        }
                        await client.query(modifyLanguageProficiencyQuery);
                    }
                    else if( ![null,undefined,''].includes(_body.candidateLanguageId) && _body.action=='delete')
                    {
                        const deleteLanguageProficiencyQuery = {
                            name: 'delete-candidate-language',
                            text: candidateQuery.deleteLanguageProficiency,
                            values: [_body.candidateLanguageId, currentTime, _body.employeeId],
                        }
                        await client.query(deleteLanguageProficiencyQuery);
                    }
                    
                    resolve({ code: 200, message: "Candidate Language updated successfully", data: {} });
                    
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
    
    export const modifyCandidateAvailability = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    
                    const modifyCandidateAvailabilityQuery = {
                        name: 'modify-candidate-availability',
                        text: candidateQuery.modifyCandidateAvailability,
                        values: [_body.candidateId,_body.availability,_body.typeOfAvailability,_body.readyToStart, currentTime, _body.employeeId],
                    }
                    await client.query(modifyCandidateAvailabilityQuery);
                    resolve({ code: 200, message: "Candidate availability updated successfully", data: {} });
                    
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
    // {
    //     "projectName": "Automated Calculator",
    //     "clientName": "Tcs",
    //     "skills": [
    //       {
    //         "skillId": 1172,
    //         "skillName": "Material-UI",
    //         "topRated": 0
    //       },
    //       {
    //         "skillId": 1174,
    //         "skillName": "AppRun",
    //         "topRated": 0
    //       }
    //     ],
    //     "projectDescription": "Good",
    //     "contribution": "Devleoepr",
    //     "doneFor": "Doog",
    //     "role": "Testing",
    //     "projectLink": "hhtp://dfg.com",
    //     "candidateId": 2,
    //     "extraProject": false,
    //     "action": "add"
    //   }
    
    export const modifyCandidateProject = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    if(_body.action === 'add')
                    {
                        var skills=JSON.stringify(_body.skills)
                        const insertCandidateProjectsQuery = {
                            name: 'insert-candidate-projects',
                            text: candidateQuery.insertCandidateProject,
                            values: [_body.candidateId,_body.projectName,_body.clientName,_body.projectDescription,_body.projectLink,_body.extraProject,skills, _body.employeeId,currentTime,_body.contribution,_body.doneFor,_body.role],
                        }
                        await client.query(insertCandidateProjectsQuery);
                    }
                    else if(![null,undefined,''].includes(_body.candidateProjectId) && _body.action==='update')
                    {
                        var skills=JSON.stringify(_body.skills)
                        const modifyCandidateProjectsQuery = {
                            name: 'modify-candidate-projects',
                            text: candidateQuery.modifyCandidateProject,
                            values: [_body.candidateProjectId,_body.candidateId,_body.projectName,_body.clientName,_body.projectDescription,_body.projectLink,_body.extraProject,skills, currentTime, _body.employeeId,_body.contribution,_body.doneFor,_body.role],
                        }
                        await client.query(modifyCandidateProjectsQuery);
                    }
                    else if( ![null,undefined,''].includes(_body.candidateProjectId) && _body.action === 'delete')
                    {
                        const deleteCandidateProjectsQuery = {
                            name: 'delete-candidate-projects',
                            text: candidateQuery.deleteCandidateProject,
                            values: [_body.candidateProjectId,currentTime,_body.employeeId],
                        }
                        await client.query(deleteCandidateProjectsQuery);
                    }
                    
                    resolve({ code: 200, message: "Candidate project updated successfully", data: {} });
                    
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
    
    
    export const modifyCandidateWorkHistory = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    
                    if(_body.action === 'add')
                    {
                        const insertCandidateWorkHistoryQuery = {
                            name: 'insert-candidate-work-history',
                            text: candidateQuery.insertCandidateWorkHistory,
                            values: [_body.candidateId,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,_body.employeeid,currentTime,_body.positionName],
                        }
                        await client.query(insertCandidateWorkHistoryQuery);
                    }
                    else if(![null,undefined,''].includes(_body.candidateWorkExperienceId) && _body.action==='update')
                    {
                        const modifyCandidateWorkHistoryQuery = {
                            name: 'modify-candidate-work-history',
                            text: candidateQuery.modifyCandidateWorkHistory,
                            values: [_body.candidateWorkExperienceId,_body.candidateId,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,currentTime,_body.employeeid,_body.positionName],
                        }
                        await client.query(modifyCandidateWorkHistoryQuery);
                    }
                    else if( ![null,undefined,''].includes(_body.candidateWorkExperienceId) && _body.action === 'delete')
                    {
                        const deleteCandidateWorkHistoryQuery = {
                            name: 'delete-candidate-work-history',
                            text: candidateQuery.deleteCandidateWorkHistory,
                            values: [_body.candidateWorkExperienceId,currentTime,_body.employeeId],
                        }
                        await client.query(deleteCandidateWorkHistoryQuery);
                    }
                    
                    resolve({ code: 200, message: "Candidate work history updated successfully", data: {} });
                    
                } catch (e) {
                    console.log(e)
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                } finally {
                    client.release();
                }
            })().catch(e => {
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} })
            })
        })
    }
    
    export const modifyEducation = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    if(_body.action === 'add')
                    {
                        const insertCandidateEducationQuery = {
                            name: 'insert-candidate-education',
                            text: candidateQuery.insertCandidateEducation,
                            values: [_body.candidateId,_body.degree,_body.college,_body.startDate,_body.endDate,_body.employeeid,currentTime],
                        }
                        await client.query(insertCandidateEducationQuery);
                    }
                    else if(![null,undefined,''].includes(_body.candidateEducationId) && _body.action==='update')
                    {
                        const modifyCandidateEducationQuery = {
                            name: 'modify-candidate-education',
                            text: candidateQuery.modifyCandidateEducation,
                            values: [_body.candidateEducationId,_body.candidateId,_body.degree,_body.college,_body.startDate,_body.endDate,currentTime,_body.employeeId],
                        }
                        await client.query(modifyCandidateEducationQuery);
                    }
                    else if( ![null,undefined,''].includes(_body.candidateEducationId) && _body.action === 'delete')
                    {
                        const deleteCandidateEducationQuery = {
                            name: 'delete-candidate-education',
                            text: candidateQuery.deleteCandidateEducation,
                            values: [_body.candidateEducationId,currentTime,_body.employeeId],
                        }
                        await client.query(deleteCandidateEducationQuery);
                    }
                    
                    resolve({ code: 200, message: "Candidate education updated successfully", data: {} });
                    
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
    
    export const modifyCloudProficiency = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    
                    let idSet = Array.isArray(_body.cloudProficiency)?_body.cloudProficiency.map(a => a.cloudProficiencyId).filter(Number):false;
                    
                    if(idSet)
                    {
                        const deleteCandidateCloudQuery = {
                            name: 'delete-candidate-cloud-proficiency',
                            text: candidateQuery.deleteCloud,
                            values: [_body.candidateId,idSet,_body.employeeId,currentTime],
                        }
                        await client.query(deleteCandidateCloudQuery);
                        
                        const insertCandidateCloudQuery = {
                            name: 'insert-candidate-cloud-proficiency',
                            text: candidateQuery.modifyCloud,
                            values: [_body.candidateId,idSet,_body.employeeId,currentTime],
                        }
                        await client.query(insertCandidateCloudQuery);
                    }
                    
                    resolve({ code: 200, message: "Candidate cloud proficiency updated successfully", data: {} });
                    
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
    
    export const modifySocialPresence = (_body) =>{
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    const insertCandidateSocialQuery = {
                        name: 'insert-candidate-social-profile',
                        text: candidateQuery.modifySocial,
                        values: [_body.candidateId,_body.github,_body.githubLink,_body.linkedin,_body.linkedinLink,_body.stackoverflow,_body.stackoverflowLink,_body.kaggle,_body.kaggleLink,_body.employeeId,currentTime],
                    }
                    await client.query(insertCandidateSocialQuery);
                    
                    
                    resolve({ code: 200, message: "Candidate social profile updated successfully", data: {} });
                    
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
    
    export const modifyPublication = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    if(_body.action === 'add')
                    {
                        const insertCandidatePublicationQuery = {
                            name: 'insert-candidate-Publication',
                            text: candidateQuery.insertCandidatePublication,
                            values: [_body.candidateId,_body.title,_body.publishedYear,_body.link,_body.employeeId,currentTime],
                        }
                        await client.query(insertCandidatePublicationQuery);
                    }
                    else if(![null,undefined,''].includes(_body.candidatePublicationId) && _body.action==='update')
                    {
                        const modifyCandidatePublicationQuery = {
                            name: 'modify-candidate-Publication',
                            text: candidateQuery.modifyCandidatePublication,
                            values: [_body.candidatePublicationId,_body.candidateId,_body.title,_body.publishedYear,_body.link,currentTime,_body.employeeId],
                        }
                        await client.query(modifyCandidatePublicationQuery);
                    }
                    else if( ![null,undefined,''].includes(_body.candidatePublicationId) && _body.action === 'delete')
                    {
                        const deleteCandidatePublicationQuery = {
                            name: 'delete-candidate-Publication',
                            text: candidateQuery.deleteCandidatePublication,
                            values: [_body.candidatePublicationId,currentTime,_body.employeeId],
                        }
                        await client.query(deleteCandidatePublicationQuery);
                    }
                    
                    resolve({ code: 200, message: "Candidate Publication updated successfully", data: {} });
                    
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
    
    export const modifyAward = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    
                    if(_body.action === 'add')
                    {
                        const insertCandidateAwardQuery = {
                            name: 'insert-candidate-Award',
                            text: candidateQuery.insertCandidateAward,
                            values: [_body.candidateId,_body.certificationId,_body.certifiedYear,_body.employeeId,currentTime],
                        }
                        await client.query(insertCandidateAwardQuery);
                    }
                    else if(![null,undefined,''].includes(_body.candidateAwardId) && _body.action==='update')
                    {
                        const modifyCandidateAwardQuery = {
                            name: 'modify-candidate-Award',
                            text: candidateQuery.modifyCandidateAward,
                            values: [_body.candidateAwardId,_body.candidateId,_body.certificationId,_body.certifiedYear,currentTime,_body.employeeId],
                        }
                        await client.query(modifyCandidateAwardQuery);
                    }
                    else if( ![null,undefined,''].includes(_body.candidateAwardId) && _body.action === 'delete')
                    {
                        const deleteCandidateAwardQuery = {
                            name: 'delete-candidate-Award',
                            text: candidateQuery.deleteCandidateAward,
                            values: [_body.candidateAwardId,currentTime,_body.employeeId],
                        }
                        await client.query(deleteCandidateAwardQuery);
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
                reject({ code: 400, message: "Failed. Please try again.", data: {} })
            })
        })
    }
    export const getResume = (_body) => {
        return new Promise((resolve, reject) => {
            const candidateId = _body.candidateId;
            console.log("candidateId : ",candidateId);
            
            var promise=[]
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    const fetchProfile = {
                        name: 'fetch-profile-details',
                        text: candidateQuery.getAllProfileDetails,
                        values: [candidateId],
                    }
                    var allProfileDetails=await client.query(fetchProfile);
                    const fetchSkills = {
                        name: 'fetch-skill-details',
                        text: candidateQuery.fetchSkillDetails,
                        values: [candidateId],
                    }
                    var skills=await client.query(fetchSkills);
                    const fetchProjects = {
                        name: 'fetch-project-details',
                        text: candidateQuery.fetchProjectDetails,
                        values: [candidateId],
                    }
                    var projects=await client.query(fetchProjects);
                    const fetchAssesements = {
                        name: 'fetch-assesement-details',
                        text: candidateQuery.fetchAssesmentDetails,
                        values: [candidateId],
                    }
                    var assesements=await client.query(fetchAssesements);
                    const fetchAssesementsLinks = {
                        name: 'fetch-assesement-links',
                        text: candidateQuery.fetchAssesmentLinks,
                        values: [candidateId],
                    }
                    var assesementsLinks=await client.query(fetchAssesementsLinks);
                    const fetchWorkExperience = {
                        name: 'fetch-work-experience-details',
                        text: candidateQuery.fetchWorkExperienceDetails,
                        values: [candidateId],
                    }
                    var workExperiences=await client.query(fetchWorkExperience);
                    let workedCompanyList =  workExperiences.rows.map(element => ({"id":element.candidateWorkExperienceId,"companyName":element.companyName}))
                    workedCompanyList  = [...workedCompanyList,{"id":0,"companyName":"On personal capacity"}];                                         
                    let companyJson = {};
                    companyJson = Object.assign({0:'On personal capacity'},companyJson);
                    workExperiences.rows.forEach(element => {
                        companyJson[element.candidateWorkExperienceId]=element.companyName;
                    });
                    const fetchEducations = {
                        name: 'fetch-education-details',
                        text: candidateQuery.fetchEducationDetails,
                        values: [candidateId],
                    }
                    var educations=await client.query(fetchEducations);
                    
                    const fetchSocialProfile = {
                        name: 'fetch-social-profile',
                        text: candidateQuery.fetchSocialProfile,
                        values: [candidateId],
                    }
                    var socialProfileDetails=await client.query(fetchSocialProfile);
                    
                    const fetchCloudProficiency = {
                        name: 'fetch-cloud-proficiency',
                        text: candidateQuery.fetchCloudProficiency,
                        values: [candidateId],
                    }
                    var cloudProficiencyDetails=await client.query(fetchCloudProficiency);
                    
                    const fetchPublications = {
                        name: 'fetch-publications-details',
                        text: candidateQuery.fetchPublicationDetails,
                        values: [candidateId],
                    }
                    var publications=await client.query(fetchPublications);
                    const fetchAwards = {
                        name: 'fetch-awards-details',
                        text: candidateQuery.fetchAwardDetails,
                        values: [candidateId],
                    }
                    var awards=await client.query(fetchAwards);
                    const fetchLanguages = {
                        name: 'fetch-language-details',
                        text: candidateQuery.fetchLanguageDetails,
                        values: [candidateId],
                    }
                    var languages=await client.query(fetchLanguages);
                    var assesmentLinksList=[
                        {
                            type:"algorithmTestLink",
                            name:"Algorithm Test",
                            link: assesementsLinks.rows[0].algorithm_test_link
                        },
                        {
                            type:"programmingTestLink",
                            name:"Programming Test Link",
                            link: assesementsLinks.rows[0].programming_test_link
                        },
                        {
                            type:"interviewLink",
                            name:"Interview Link",
                            link: assesementsLinks.rows[0].interview_link
                        }
                    ]
                    if (Array.isArray(projects.rows))
                    {
                        projects.rows.forEach(element => {
                            
                            let candidateProjectId=element.candidateProjectId
                            let candidateId=element.candidateId
                            let projectName=element.projectName
                            let clientName=element.clientName
                            let yearsOfExperience=element.yoe
                            let projectDescription=element.projectDescription
                            let  projectLink=element.projectLink
                            let skill=element.skills
                            let contribtion=element.contribution
                            let parentCompany=element.doneFor
                            let doneForName = companyJson[element.doneFor]                            
                            let roleDone=element.role
                            let skills=JSON.parse(skill)
                            let extraProject=element.extraProject
                            promise.push({candidateProjectId:candidateProjectId,candidateId:candidateId,projectName:projectName,clientName:clientName,
                                yearsOfExperience:yearsOfExperience,projectDescription:projectDescription,projectLink:projectLink,contribution:contribtion,doneFor:parentCompany,doneForName,role:roleDone,
                                skills:skills,extraProject:extraProject})
                            });
                            await Promise.all(promise);
                        }
                        let citizenship = allProfileDetails.rows[0].citizenship;
                        let citizenshipName = ![null,undefined,""].includes(citizenship)?config.countries.filter(element=>element.id == citizenship)[0].name:'';
                        let residence = allProfileDetails.rows[0].residence;
                        // let residenceName = ![null,undefined,""].includes(residence)?config.countries.filter(element=>element.id == residence)[0].name:'';
                        
                        let profileDetails = {
                            firstName : allProfileDetails.rows[0].firstName,
                            lastName : allProfileDetails.rows[0].lastName,
                            candidatePositionName:allProfileDetails.rows[0].candidatePositionName,
                            description : allProfileDetails.rows[0].description,
                            candidateStatus : allProfileDetails.rows[0].candidateStatus,
                            sellerCompanyId : allProfileDetails.rows[0].sellerCompanyId,
                            image : allProfileDetails.rows[0].image,
                            citizenship,
                            citizenshipName,
                            residence,
                            phoneNumber : allProfileDetails.rows[0].phoneNumber,
                            email : allProfileDetails.rows[0].email,
                            candidateVetted : allProfileDetails.rows[0].candidateVetted
                        }
                        let overallWorkExperience = {
                            cost:allProfileDetails.rows[0].rate,
                            ellowRate:allProfileDetails.rows[0].ellowRate,
                            workExperience:allProfileDetails.rows[0].workExperience,
                            remoteWorkExperience:allProfileDetails.rows[0].remoteWorkExperience,
                            billingTypeId:allProfileDetails.rows[0].billingTypeId,
                            currencyTypeId:allProfileDetails.rows[0].currencyTypeId,
                            candidatePositionName:allProfileDetails.rows[0].candidatePositionName,
                        }
                        let availability = {
                            availability : allProfileDetails.rows[0].availability,
                            typeOfAvailability : allProfileDetails.rows[0].typeOfAvailability,
                            readyToStart : allProfileDetails.rows[0].readyToStart
                        }
                        
                        let assesementComment = allProfileDetails.rows[0].assessmentComment;
                        
                        await client.query('COMMIT')
                        resolve({ code: 200, message: "Resume listed successfully", 
                        data: 
                        {candidateId:Number(_body.candidateId),
                            profile:profileDetails,
                            resume : allProfileDetails.rows[0].resume,
                            overallWorkExperience,
                            availability,
                            socialPresence:socialProfileDetails.rows[0],
                            candidateCloudProficiency:cloudProficiencyDetails.rows,
                            skills:skills.rows,
                            projects:promise,
                            assesments:assesements.rows,
                            assesmentLink:assesmentLinksList,
                            assesementComment,
                            workExperience:workExperiences.rows,
                            education:educations.rows,
                            publications:publications.rows,
                            awards:awards.rows,
                            languages:languages.rows,
                            workedCompanyList
                        } });
                        
                    } catch (e) {
                        console.log(e)
                        await client.query('ROLLBACK')
                        reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                    } finally {
                        client.release();
                    }
                })().catch(e => {
                    reject({ code: 400, message: "Failed. Please try again.", data: {} })
                })
            })
        }
        export const addWorkExperience = (_body) => {
            return new Promise((resolve, reject) => {
                const currentTime = Math.floor(Date.now() / 1000);
                (async () => {
                    const client = await database().connect()
                    try {
                        
                        const addWorkExperiences = {
                            name: 'add-work-experiences',
                            text: candidateQuery.addExperience,
                            values: [_body.candidateId,_body.workExperience,_body.remoteWorkExperience,_body.cost,_body.billingTypeId,_body.currencyTypeId,currentTime,_body.employeeId],
                        }
                        await client.query(addWorkExperiences);
                        
                        resolve({ code: 200, message: "Candidate overall work experience updated successfully", data: {} });
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
        export const addResumeShareLink = (_body) => {
            return new Promise((resolve, reject) => {
                const currentTime = Math.floor(Date.now());
                (async () => {
                    const client = await database().connect()
                    try {
                        if(!isNaN(_body.candidateId))
                        {
                            
                            let uniqueId = nanoid();
                            console.log("uniqueId : ",uniqueId);
                            const addResumeShare = {
                                name: 'add-resume-share',
                                text: candidateQuery.addResumeShare,
                                values: [_body.candidateId,uniqueId,_body.employeeId,currentTime],
                            }
                            await client.query(addResumeShare);
                            resolve({ code: 200, message: "Candidate resume share link updated", data: uniqueId });
                            
                        }
                        else
                        {
                            reject({ code: 400, message: "Invalid candidateId", data: {} });
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
        
        export const fetchResumeData = (_body) => {
            return new Promise((resolve, reject) => {
                const currentTime = Math.floor(Date.now() / 1000);
                (async () => {
                    const client = await database().connect()
                    try {
                        const getCandidateId = {
                            name: 'fetch-candidateid',
                            text: candidateQuery.fetchResumeDatafromUniqueId,
                            values: [_body.uniqueId],
                        }
                        let result = await client.query(getCandidateId);
                        if(result.rows[0])
                        {
                            let candidateId = result.rows[0].candidate_id;
                            
                            _body.candidateId = candidateId;
                            let data = await getResume(_body);                                                        
                            resolve({ code: 200, message: "Candidate resume listed successfully", data:data["data"] });
                        }
                        else{
                            reject({ code: 400, message: "Id does not match with data available", data: {} });
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
        
        export const modifyResumeFile = (_body) => {
            return new Promise((resolve, reject) => {
                const currentTime = Math.floor(Date.now() / 1000);
                (async () => {
                    const client = await database().connect()
                    try {
                        const updateResumeFile = {
                            name: 'update-resumeFile',
                            text: candidateQuery.modifyResumeFile,
                            values: [_body.candidateId,_body.resume,currentTime,_body.employeeId],
                        }
                        await client.query(updateResumeFile);
                        resolve({ code: 200, message: "Candidate resume file updated successfully", data: {} });
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