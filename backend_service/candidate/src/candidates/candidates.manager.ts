import candidateQuery from './query/candidates.query';
import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import config from '../config/config';
import { createNotification } from '../common/notifications/notifications';
import * as emailClient from '../emailService/emailService';
import {nanoid} from 'nanoid';
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import * as htmlToPdf from "html-pdf-node";
// import * as fs from 'fs'
import * as nodeCache from 'node-cache';
// >>>>>>> FUNC. >>>>>>>
//>>>>>>>> Get the details of an individual candidate
const myCache = new nodeCache();



export const getCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                let skills =[]
                await client.query('BEGIN');
                
                // Get the basic details of the candidates
                const listCandidateQuery = {
                    name: 'get-candidate-details',
                    text: candidateQuery.getCandidateDetails,
                    values: [_body.candidateId],
                }
                let results = await client.query(listCandidateQuery);
                const candidate = results.rows;
                const getCandidateAssessmentTraitsQuery = {
                    name: 'get-candidate-assessmentTraits',
                    text: candidateQuery.getAssessmentTraits,
                    values: [_body.candidateId],
                }
                let value = await client.query(getCandidateAssessmentTraitsQuery);
                
                // Retrieving the assesment traits added by the admin,about the candidate.
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
    
    
    
    // >>>>>>> FUNC. >>>>>>>
    // />>>>>>>> FUnction for listing all the candidates with his/her basic details.
    export const listCandidatesDetails = (_body) => {
        return new Promise((resolve, reject) => {
            var selectQuery = candidateQuery.listCandidates;
            
            var adminApproveQuery='',queryText='', searchQuery='',queryValues={}, filterQuery='', filter=_body.body!=undefined?_body.body.filter:'',
            body=_body.query, sort = '', searchKey = '%%';
            
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
    
    
    
    
    // >>>>>>> FUNC. >>>>>>>
    //>>>>>>>>>>>Listing all the free candidates from the candidates list.
    export const listFreeCandidatesDetails = (_body) => {
        return new Promise((resolve, reject) => {
            var selectQuery = candidateQuery.listFreeCandidates;
            var roleBasedQuery='',queryText='', searchQuery='',queryValues={}, filterQuery='', filter=_body.body!=undefined?_body.body.filter:'',
            body=_body.query, sort = '', searchKey = '%%';
            
            
            
            // Sorting keys with values
            const orderBy = {
                "candidateId": 'ca.candidate_id',
                "candidateFirstName": 'ca.candidate_first_name',
                "candidatelastName": 'ca.candidate_last_name',
                "email": 'ca.email_address',
                "phoneNumber": 'ca.phone_number',
                "companyName": 'c.company_name',
                "updatedOn" : 'ca.updated_on'
            }
            
            
            // Search for filters in the body
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
    
    // >>>>>>> FUNC. >>>>>>>
    //>>>>>>>>>>>Listing required candidates for add from list from the candidates list.
    export const listAddFromListCandidates = (_body) => {
        return new Promise((resolve, reject) => {
            var selectQuery = candidateQuery.getCandidateForAddFromList;
            var roleBasedQuery='',queryText='', searchQuery='',queryValues={}, filterQuery='', filter=_body.body!=undefined?_body.body.filter:'',
            body=_body.query, sort = '', searchKey = '%%';
            
            
            
            // Sorting keys with values
            const orderBy = {
                "candidateId": 'ca.candidate_id',
                "candidateFirstName": 'ca.candidate_first_name',
                "candidatelastName": 'ca.candidate_last_name',
                "email": 'ca.email_address',
                "phoneNumber": 'ca.phone_number',
                "companyName": 'c.company_name',
                "updatedOn" : 'ca.updated_on'
            }
            
            
            // Search for filters in the body
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
                        name: 'get-addfromlist-candidates',
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
                            message = `${firstName + ' ' + lastName} from ${companyName} has been selected for the position:${positionName}`;
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
                            emailClient.emailManager(config.adminEmail,subj,path,adminReplacements);
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
                            let path = 'src/emailTemplates/rejectionMailText.html';
                            let adminReplacements = {
                                fName: firstName,
                                lName: lastName,
                                cName: companyName,
                                pName: positionName
                            };
                            emailClient.emailManager(config.adminEmail,subj,path,adminReplacements);
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
                    let imageResults=await client.query(queryService.getImageDetails(_body))
                    _body.userRoleId != 1 && await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate',userRoleId:_body.userRoleId,employeeId:_body.employeeId,image:imageResults.rows[0].image,firstName:imageResults.rows[0].candidate_first_name,lastName:imageResults.rows[0].candidate_last_name });
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
                    let imageResults=await client.query(queryService.getImageDetails(_body))
                    await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate',userRoleId:_body.userRoleId,employeeId:_body.employeeId,image:imageResults.rows[0].image,firstName:imageResults.rows[0].candidate_first_name,lastName:imageResults.rows[0].candidate_last_name })
                    
                    var hirerCompanyName = interviewDetails[0].hirerCompanyName.toUpperCase()
                    candidateFirstName = interviewDetails[0].candidateFirstName === null ? '' : interviewDetails[0].candidateFirstName
                    candidateLastName = interviewDetails[0].candidateLastName === null ? '' : interviewDetails[0].candidateLastName
                    var positionName = interviewDetails[0].positionName === null ? '' : interviewDetails[0].positionName
                    var email = interviewDetails[0].emailAddress === null ? '' : interviewDetails[0].emailAddress
                    var phoneNumber = interviewDetails[0].phoneNumber === null ? '' : interviewDetails[0].phoneNumber
                    var subject = "Request for Interview from " + hirerCompanyName;
                    let path = 'src/emailTemplates/interviewRequestMailText.html';
                    let adminReplacements = {
                        hirerName: hirerCompanyName,
                        firstName: candidateFirstName,
                        lastName: candidateLastName,
                        position: positionName,
                        emailId: email,
                        telephoneNumber: phoneNumber
                    };
                    emailClient.emailManager(config.adminEmail,subject,path,adminReplacements);
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
            const data = _body.assessmentTraits;
            let promise = [];
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    
                    // Update assesment ratings about the candidate.
                    data.forEach(element => {
                        _body.candidateAssesmentId = element.candidateAssesmentId;
                        _body.rating = element.rating;
                        element.isLinkAvailable?(element.assesmentComment=="Code|Algorithm Test"?_body.codeTestLink=element.link:element.assesmentComment=="Interview Test"?_body.interviewTestLink=element.link:""):"";
                        promise.push(client.query(queryService.candidateDetails(_body)));
                    });
                    
                    console.log("_body  L ",_body);
                    
                    // Insert assesment comments about the candidate
                    promise.push(client.query(queryService.updateCommentAndLinks(_body)));
                    
                    await Promise.all(promise);
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
            const currentTime = Math.floor(Date.now());
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
                        values: [candidateId, positionId, _body.employeeId, currentTime],
                    }
                    await client.query(removeCandidateQuery);
                    
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
                    var subject = "Candidate Deletion Notification";
                    let imageResults=await client.query(queryService.getImageDetails(_body))
                    message = `${candidateFirstName + ' ' + candidateLastName} who had applied for the position ${positionName} has been removed `
                    let path = 'src/emailTemplates/candidateDeletionMailText.html';
                    let replacements ={
                        hirer: hirerName,
                        position: positionName,
                        name1: candidateFirstName,
                        name2: candidateLastName
                    };
                    emailClient.emailManager(sellerMail,subject,path,replacements);
                    await client.query('COMMIT')
                    await createNotification({ positionId, jobReceivedId, companyId: _body.companyId, message, candidateId, notificationType: 'candidateChange',userRoleId:_body.userRoleId,employeeId:_body.employeeId,image:imageResults.rows[0].image,firstName:imageResults.rows[0].candidate_first_name,lastName:imageResults.rows[0].candidate_last_name })
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
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    let promise = [];
                    const candidateList = _body.candidates;
                    const positionId = _body.positionId;
                    let positionName='';
                    let hirerName='';
                    var names=''
                    let count=0
                    const currentTime = Math.floor(Date.now());
                    
                    // Get position realted details
                    const getPositionNames = {
                        name: 'get-position-details',
                        text: candidateQuery.getPositionDetails,
                        values: [_body.positionId],
                    }
                    var positionResult=await client.query(getPositionNames);
                    positionName=positionResult.rows[0].positionName
                    hirerName=positionResult.rows[0].hirerName
                    var jobReceivedId=positionResult.rows[0].jobReceivedId
                    
                    // Inserting candidates to candidate_positions table
                    if (_body.userRoleId==1)
                    {
                        candidateList.forEach(element => {
                            const linkCandidateByAdminQuery = {
                                name: 'link-candidate-with-position',
                                text: candidateQuery.linkCandidateWithPositionByAdmin,
                                values: [positionId, element.candidateId, _body.employeeId, currentTime,element.ellowRate,element.currencyTypeId,element.billingType,element.adminComment,1],
                            }
                            count=count+1
                            promise.push(client.query(linkCandidateByAdminQuery));
                        });
                        await Promise.all(promise);
                    }
                    else{
                        candidateList.forEach(element => {
                            const linkCandidateQuery = {
                                name: 'link-candidate-with-position',
                                text: candidateQuery.linkCandidateWithPosition,
                                values: [positionId, element.candidateId, _body.employeeId, currentTime],
                                // ellowrate,currencytypeid,billing type,admincomment,admin approve status -1
                                // check user role id 
                            }
                            count=count+1
                            promise.push(client.query(linkCandidateQuery));
                        });
                        await Promise.all(promise);
                    }
                    // Sending notification to ellow recuiter for each candidate linked to a position
                    candidateList.forEach(async element => {
                        let imageResults =  await client.query(queryService.getImageDetails(element))                        
                        var firstName=imageResults.rows[0].candidate_first_name
                        var lastName=imageResults.rows[0].candidate_last_name
                        names=
                        names=names+"\n"+firstName+" "+lastName+","
                        var email=imageResults.rows[0].email_address
                        let replacements = {
                            name:firstName,
                            positionName:positionName,
                            companyName:hirerName
                        };
                        let path = 'src/emailTemplates/addCandidatesUsersText.html';
                        emailClient.emailManager(email,config.text.addCandidatesUsersTextSubject,path,replacements);
                    });  
                    await client.query('COMMIT')
                    let message=`${count} candidates has been added for the position ${positionName}`
                    createNotification({ positionId:_body.positionId, jobReceivedId:jobReceivedId, companyId: _body.companyId, message:message, candidateId:null, notificationType: 'candidateList',userRoleId:_body.userRoleId,employeeId:_body.employeeId,image:null,firstName:null,lastName:null})
                    console.log(names)
                    let replacements = {
                        positionName:positionName,
                        names:names
                    };
                    let path = 'src/emailTemplates/addCandidatesText.html';
                    emailClient.emailManager(config.adminEmail,config.text.addCandidatesTextSubject,path,replacements);
                    
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
                    await client.query(queryService.updateResumeFile(_body));
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
                reject({ code: 400, message: "Failed. Please try again.", data: e.message })
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
            (async () => {
                const client = await database().connect()
                try {
                    switch(_body.action)
                    {
                        case 'add':
                        await client.query(queryService.insertLanguageProficiencyQuery(_body));
                        break;
                        
                        case 'update' :
                        case ![null,undefined,''].includes(_body.candidateLanguageId):
                        await client.query(queryService.modifyLanguageProficiencyQuery(_body));
                        break;
                        
                        case 'delete':
                        case ![null,undefined,''].includes(_body.candidateLanguageId):
                        await client.query(queryService.deleteLanguageProficiencyQuery(_body));
                        break;
                        
                        default:
                        reject({ code: 400, message: "Invalid candidateLanguageId or action ", data: {} });
                    }
                    await client.query('COMMIT')
                    resolve({ code: 200, message: "Candidate Language updated successfully", data: {} });   
                } catch (e) {
                    console.log("error caught : ",e)
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                } finally {
                    client.release();
                }
            })().catch(e => {
                console.log("error caught 2 : ",e)
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
            (async () => {
                const client = await database().connect()
                try {
                    switch(_body.action)
                    {
                        case 'add':
                        _body.skills=JSON.stringify(_body.skills)
                        await client.query(queryService.insertCandidateProjectsQuery(_body));
                        break;
                        
                        case 'update' :
                        case ![null,undefined,''].includes(_body.candidateProjectId):
                        _body.skills=JSON.stringify(_body.skills)
                        await client.query(queryService.modifyCandidateProjectsQuery(_body));
                        break;
                        
                        case 'delete':
                        case ![null,undefined,''].includes(_body.candidateProjectId):
                        await client.query(queryService.deleteCandidateProjectsQuery(_body));
                        break;
                        
                        default:
                        reject({ code: 400, message: "Invalid candidateProjectId or action ", data: {} });
                    }
                    
                    resolve({ code: 200, message: "Candidate project updated successfully", data: {} });
                    
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
            (async () => {
                const client = await database().connect()
                try {
                    switch(_body.action)
                    {
                        case 'add':
                        await client.query(queryService.insertCandidateWorkHistoryQuery(_body));
                        break;
                        
                        case 'update' :
                        case ![null,undefined,''].includes(_body.candidateWorkExperienceId):
                        await client.query(queryService.modifyCandidateWorkHistoryQuery(_body));
                        break;
                        
                        case 'delete':
                        case ![null,undefined,''].includes(_body.candidateWorkExperienceId):
                        await client.query(queryService.deleteCandidateWorkHistoryQuery(_body));
                        break;
                        
                        default:
                        reject({ code: 400, message: "Invalid candidateWorkExperienceId or action ", data: {} });
                    }
                    resolve({ code: 200, message: "Candidate work history updated successfully", data: {} });
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
            (async () => {
                const client = await database().connect()
                try {
                    switch(_body.action)
                    {
                        case 'add':
                        await client.query(queryService.insertCandidateEducationQuery(_body));
                        break;
                        
                        case 'update' :
                        case ![null,undefined,''].includes(_body.candidateEducationId):
                        await client.query(queryService.modifyCandidateEducationQuery(_body));
                        break;
                        
                        case 'delete':
                        case ![null,undefined,''].includes(_body.candidateEducationId):
                        await client.query(queryService.deleteCandidateEducationQuery(_body));
                        break;
                        
                        default:
                        reject({ code: 400, message: "Invalid candidateEducationId or action ", data: {} });
                    }
                    
                    resolve({ code: 200, message: "Candidate education updated successfully", data: {} });
                    
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
                    _body.idSet = Array.isArray(_body.cloudProficiency)?_body.cloudProficiency.map(a => a.cloudProficiencyId).filter(Number):false;
                    if(_body.idSet)
                    {
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
    export const modifySocialPresence = (_body) =>{
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
            (async () => {
                const client = await database().connect()
                try {
                    switch(_body.action)
                    {
                        case 'add':
                        await client.query(queryService.insertCandidatePublicationQuery(_body));
                        break;
                        
                        case 'update' :
                        case ![null,undefined,''].includes(_body.candidatePublicationId):
                        await client.query(queryService.modifyCandidatePublicationQuery(_body));
                        break;
                        
                        case 'delete':
                        case ![null,undefined,''].includes(_body.candidatePublicationId):
                        await client.query(queryService.deleteCandidatePublicationQuery(_body));
                        break;
                        
                        default:
                        reject({ code: 400, message: "Invalid candidatePublicationId or action ", data: {} });
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
    
    
    
    // >>>>>>> FUNC. >>>>>>>
    // >>>>>>>>>>>>> Update any awards acheived by the candidate
    export const modifyAward = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now());
            (async () => {
                const client = await database().connect()
                try {
                    switch(_body.action)
                    {
                        case 'add':
                        await client.query(queryService.insertCandidateAwardQuery(_body));
                        break;
                        
                        case 'update' :
                        case ![null,undefined,''].includes(_body.candidateAwardId):
                        await client.query(queryService.modifyCandidateAwardQuery(_body));
                        break;
                        
                        case 'delete':
                        case ![null,undefined,''].includes(_body.candidateAwardId):
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
                console.log("E",e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} })
            })
        })
    }
    
    export const modifySkill = (_body) => {
        return new Promise((resolve, reject) => {
            (async () => {
                const client = await database()
                try {
                    switch(_body.action)
                    {
                        case 'add':
                        _body.skillId = ![null,undefined,''].includes(_body.skill)?_body.skill.skillId:null;
                        await client.query(queryService.insertCandidateSkillQuery(_body));
                        break;
                        
                        case 'update' :
                        case ![null,undefined,''].includes(_body.candidateSkillId):
                        _body.skillId = ![null,undefined,''].includes(_body.skill)?_body.skill.skillId:null;
                        await client.query(queryService.modifyCandidateSkillQuery(_body));
                        break;
                        
                        case 'delete':
                        case ![null,undefined,''].includes(_body.candidateSkillId):
                        _body.skillId = ![null,undefined,''].includes(_body.skill)?_body.skill.skillId:null;
                        await client.query(queryService.deleteCandidateSkillQuery(_body));
                        break;
                        
                        default:
                        reject({ code: 400, message: "Invalid candidateSkillId or action ", data: {} });
                    }
                    
                    resolve({ code: 200, message: "Candidate Skill updated successfully", data: {} });
                    
                } catch (e) {
                    console.log('Error 1 : ',e)
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                } finally {
                }
            })().catch(e => {
                console.log('Error 2 : ',e)
                reject({ code: 400, message: "Failed. Please try again.", data: e.message })
            })
        })
    }
    
    
    // >>>>>>> FUNC. >>>>>>>
    // >>>>>>>>>>>>> Fetch resume details about the candidate.  ( Resume Page)
    export const getResume = (_body) => {
        return new Promise((resolve, reject) => {
            const candidateId = _body.candidateId;
            
            var projectArray=[];
            var assesmentArray=[]
            const currentTime = Math.floor(Date.now());
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    
                    var allProfileDetails=await client.query(queryService.fetchProfile(candidateId));
                    var skills=await client.query(queryService.fetchSkills(candidateId));
                    var projects=await client.query(queryService.fetchProjects(candidateId));
                    var assesements=await client.query(queryService.fetchAssesements(candidateId));
                    var assesmentLink=await client.query(queryService.fetchAssesementsLinks(candidateId));
                    var workExperiences=await client.query(queryService.fetchWorkExperience(candidateId));
                    var educations=await client.query(queryService.fetchEducations(candidateId));
                    var socialProfileDetails=await client.query(queryService.fetchSocialProfile(candidateId));
                    var cloudProficiencyDetails=await client.query(queryService.fetchCloudProficiency(candidateId));
                    var publications=await client.query(queryService.fetchPublications(candidateId));
                    var awards=await client.query(queryService.fetchAwards(candidateId));
                    var languages=await client.query(queryService.fetchLanguages(candidateId));
                    
                    
                    let workedCompanyList =  workExperiences.rows.map(element => ({"id":element.candidateWorkExperienceId,"companyName":element.companyName}))
                    workedCompanyList  = [...workedCompanyList,{"id":0,"companyName":"On personal capacity"}];                                         
                    let companyJson = {};
                    companyJson = Object.assign({0:'On personal capacity'},companyJson);
                    workExperiences.rows.forEach(element => { companyJson[element.candidateWorkExperienceId]=element.companyName });
                    
                    
                    if (Array.isArray(assesements.rows))
                    {
                        assesements.rows.forEach(element => {
                            assesmentArray.push({
                                candidateAssesmentId:element.candidateAssesmentId,
                                candidateId:element.candidateId,
                                assesmentComment:element.assesmentComment,
                                rating:element.rating,
                                assementType:element.assementType,
                                isLinkAvailable:element.isLinkAvailable,
                                link: element.isLinkAvailable ? element. assesmentComment == 'Code|Algorithm Test' ? assesmentLink.rows[0].codeTestLink : assesmentLink.rows[0].interviewTestLink : "",
                                status: element.isLinkAvailable ? element. assesmentComment == 'Code|Algorithm Test' ? assesmentLink.rows[0].codeTestStatus : assesmentLink.rows[0].interviewTestStatus : ""
                            })
                            
                        });
                    }                    
                    
                    if (Array.isArray(projects.rows))
                    {
                        projects.rows.forEach(element => {
                            projectArray.push({
                                candidateProjectId:element.candidateProjectId,
                                candidateId:element.candidateId,
                                projectName:element.projectName,
                                clientName:element.clientName,
                                yearsOfExperience:element.yoe,
                                projectDescription:element.projectDescription,
                                projectLink:element.projectLink,
                                contribution:element.contribution,
                                doneFor:element.doneFor,
                                doneForName:companyJson[element.doneFor],
                                role:element.role,
                                skills:JSON.parse(element.skills),
                                extraProject:element.extraProject
                            })
                        });
                    }
                    
                    let citizenship = allProfileDetails.rows[0].citizenship;
                    let citizenshipName = ![null,undefined,""].includes(citizenship)?config.countries.filter(element=>element.id == citizenship)[0].name:'';
                    let residence = allProfileDetails.rows[0].residence;
                    
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
                        projects:projectArray,
                        assesments:assesmentArray,
                        assesmentLink:assesmentLink.rows[0],
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
                    if(!isNaN(_body.candidateId))
                    {
                        _body.uniqueId = nanoid();
                        let sharedEmails=[],domain='',flag=0;
                        
                        let domainResult = await client.query(queryService.getDomainFromEmployeeId(_body));
                        domain = domainResult.rows[0].domain;
                        
                        let filteredEmails = _body.sharedEmails.filter((element)=> element.endsWith('@'+domain));
                        _body.sharedEmails.length!=filteredEmails.length?flag=1:'';
                        
                        _body.sharedEmails = filteredEmails;                        
                        let result = await client.query(queryService.addResumeShare(_body));
                        let results = await client.query(queryService.getNames(_body));
                        if(![null,undefined].includes(result.rows) && result.rows.length > 0)
                        {
                            _body.uniqueId = result.rows[0].unique_key;
                            sharedEmails = result.rows[0].shared_emails;
                            var link=_body.host+'/shareResume/'+_body.uniqueId
                            if (Array.isArray(sharedEmails))
                            {
                                sharedEmails.forEach(element => {
                                    var firstName=results.rows[0].firstname
                                    var lastName=results.rows[0].lastname
                                    let replacements = {
                                        fName:firstName,
                                        lName:lastName,
                                        link:link
                                    };
                                    let path = 'src/emailTemplates/resumeShareText.html';
                                    emailClient.emailManager(element,config.text.shareEmailSubject,path,replacements);
                                    
                                });
                            } 
                        }
                        
                        if(flag==0)
                        resolve({ code: 200, message: "Candidate resume share link updated", data: sharedEmails });
                        else
                        resolve({ code: 201, message: "Some of the emails shared does not belong to your company email domain", data: sharedEmails });
                        
                    }
                    else
                    {
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
                reject({ code: 400, message: "Failed. Please try again.", data:e.message })
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
                    if(!isNaN(_body.candidateId))
                    {
                        let result = await client.query(queryService.getSharedEmails(_body));
                        let sharedEmails = [undefined,null].includes(result.rows[0])?[]:result.rows[0].sharedEmails;
                        resolve({ code: 200, message: "Candidate shared emails retrieved", data: sharedEmails });
                    }
                    else
                    {
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
                reject({ code: 400, message: "Failed. Please try again.", data:e.message })
            })
        })
    }
    export const shareResumeSignup = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    console.log("1");
                    
                    let result = await client.query(queryService.getSharedEmailsWithToken(_body));
                    console.log("result : ",result.rows);
                    
                    if(result.rows[0]['sharedEmails'].includes(_body.email))
                    {
                        console.log("inside if ");
                        
                        let emailCheck = await client.query(queryService.getEmail(_body));
                        
                        console.log("email check ",emailCheck);
                        
                        if(emailCheck.rowCount==0)
                        {
                            const getId = {
                                name: 'get-company-id',
                                text: candidateQuery.getCompanyId,
                                values: [result.rows[0].updatedBy],
                            }
                            var getcompanyId=await client.query(getId)
                            var cmpId=getcompanyId.rows[0].company_id
                            const password = passwordGenerator.generate({
                                length: 10,
                                numbers: true
                            });
                            var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                            const insertData = {
                                name: 'insert-values',
                                text: candidateQuery.insertUserDetails,
                                values: [_body.firstName,_body.lastName,_body.email,_body.telephoneNumber,cmpId,hashedPassword,currentTime,true,2],
                            }
                            await client.query(insertData)
                            let replacements = {
                                fName:_body.firstName,
                                password:password
                            };
                            let path = 'src/emailTemplates/newUserText.html';
                            emailClient.emailManager(_body.email,config.text.newUserTextSubject,path,replacements);
                            let adminReplacements = {
                                firstName:_body.firstName,
                                lastName:_body.lastName,
                                email:_body.email,
                                phone:_body.telephoneNumber
                                
                            };
                            let adminPath = 'src/emailTemplates/newUserAdminText.html';
                            emailClient.emailManager(config.adminEmail,config.text.newUserAdminTextSubject,adminPath,adminReplacements);
                            await client.query('COMMIT')
                            resolve({ code: 200, message: "Employee Added Successfully", data: {}})
                        }
                        else{
                            reject({ code: 400, message: "User already registered pleases use signin to continue", data: {} });
                        }
                    } 
                    else{
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
                reject({ code: 400, message: "Failed. Please try again.", data:e.message })
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
                    if(result.rows[0])
                    {
                        let emailResult = await client.query(queryService.getEmailFromEmployeeId(_body));
                        
                        
                        if(result.rows[0].shared_emails.includes(emailResult.rows[0].email))
                        {
                            let candidateId = result.rows[0].candidate_id;
                            _body.candidateId = candidateId;
                            let data = await getResume(_body);            
                            delete data["data"].assesmentLink;
                            delete data["data"].assesementComment;
                            delete data["data"].assesments;
                            
                            resolve({ code: 200, message: "Candidate resume listed successfully", data:data["data"] });
                        }
                        else
                        {
                            reject({ code: 400, message: "You do not have access to this content", data: {} });
                        }         
                    }
                    else{
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
                    if(result.rows[0])
                    {
                        let candidateId = result.rows[0].candidate_id;
                        _body.candidateId = candidateId;
                        
                        var allProfileDetails=await client.query(queryService.fetchProfile(candidateId));
                        var skills=await client.query(queryService.fetchSkills(candidateId));
                        var projects=await client.query(queryService.fetchProjects(candidateId));
                        let citizenship = allProfileDetails.rows[0].citizenship;
                        let citizenshipName = ![null,undefined,""].includes(citizenship)?config.countries.filter(element=>element.id == citizenship)[0].name:'';
                        let residence = allProfileDetails.rows[0].residence;
                        
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
                        await client.query('COMMIT')
                        resolve({ code: 200, message: "Initial Resume data listed successfully", 
                        data: 
                        {candidateId:Number(_body.candidateId),
                            profile:profileDetails,
                            resume : allProfileDetails.rows[0].resume,
                            overallWorkExperience,
                            availability,
                            skills:skills.rows
                        } });
                    }
                    else{
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
    //>>>>>>>> Update code and interview test to database
    export const updateTestResults = (_body) => {
        return new Promise((resolve, reject) => {
            (async () => {
                const client = await database().connect()
                try {
                    switch(_body.type)
                    {
                        case 'codeTest':
                        await client.query(queryService.updateCodeTestStatus(_body));
                        break;
                        case 'interviewTest':
                        await client.query(queryService.updateInterviewTestStatus(_body));
                        break;
                        default:
                        reject({ code: 400, message: "Assessment test status type not found", data: {} });
                        return;
                    }
                    
                    resolve({ code: 200, message: "Assesment status updated succesfully", data:{} });
                    
                } catch (e) {
                    console.log(e)
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                } finally {
                    client.release();
                }
            })().catch(e => {
                reject({ code: 400, message: "Failed. Please try again.", data:e.message })
            })
        })
    }
    export const getAssesmentLinks = (_body) => {
        return new Promise((resolve, reject) => {
            (async () => {
                const client = await database().connect()
                try {
                    var candidateId=_body.candidateId
                    var assesmentLink=await client.query(queryService.fetchAssesementsLinks(candidateId));
                    resolve({ code: 200, message: "Assesment links listed succesfully", data:{assesmentLinks:assesmentLink} });
                    
                } catch (e) {
                    console.log(e)
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                } finally {
                    client.release();
                }
            })().catch(e => {
                reject({ code: 400, message: "Failed. Please try again.", data:e.message })
            })
        })
    }

    
    // create pdf
    
    export const createPdfFromHtml = (_body) => {
        return new Promise((resolve, reject) => {
            (async () => {
                const client = await database()
                try {
                    var candidateId=_body.candidateId
                    let uniqueId = nanoid();
                    myCache.set( uniqueId, candidateId );
                    console.log("uniqueId ",uniqueId);
                    let oldEmailResult = await client.query(queryService.saveSharedEmailsForpdf(_body));
                    console.log("oldEmails : ",oldEmailResult.rows[0]);
                    _body.sharedEmails = _body.sharedEmails.filter(elements=> elements!=null);
                    console.log("sharedEmails : ", _body.sharedEmails);
                    
                    let options = { format: 'A4',printBackground:true,headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox'] };
                    // Example of options with args //
                    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
                    // console.log(`Current directory: ${process.cwd()}`);
                    //  let file = {content: fs.readFileSync('./resume.html', 'utf8')};

                     let file = { url: _body.host+"/sharePdf/"+uniqueId };
                     console.log('file : ',file);
                     
                   
                    await htmlToPdf.generatePdf(file, options).then(pdfBuffer => 
                        {
                            if (Array.isArray(_body.sharedEmails))
                            {
                                _body.sharedEmails.forEach(element => {
                                        console.log("Email",element)
                                        let replacements = {
                        
                                        };
                                        let path = 'src/emailTemplates/sharePdfText.html';
                                        emailClient.emailManagerWithAttachments(element,config.text.sharePdfTextSubject,path,replacements,pdfBuffer);
                                    })
                                }
                    });
                    
                    await client.query('COMMIT')

                    resolve({ code: 200, message: "Created pdf succesfully", data:{} });
                    
                } catch (e) {
                    console.log(e)
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                }
            })().catch(e => {
                reject({ code: 400, message: "Failed. Please try again.", data:e.message })
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
                    console.log("fetchResumeDataForPdf");
                    console.log("body : ",_body);
                    console.log("hasUniqueId : ",myCache.has(_body.uniqueId));

                    if(myCache.has(_body.uniqueId))
                    {
                        let candidateId = myCache.take(_body.uniqueId);                                        
                        _body.candidateId = candidateId;
                        console.log("candidateId : ",candidateId);
                        let data = await getResume(_body);            
                        delete data["data"].assesmentLink;
                        delete data["data"].assesementComment;
                        delete data["data"].assesments;
                        console.log('data : ',data["data"]);
                        resolve({ code: 200, message: "Candidate resume shared data fetched successfully", data:data["data"] });
                        
                    }
                    else{
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
                    let reqdEmails = ![undefined,null].includes(sharedEmails.rows[0])?sharedEmails.rows[0].sharedemails:[];
                    resolve({ code: 200, message: "Shared emails listed successfully", data:reqdEmails});
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
    
