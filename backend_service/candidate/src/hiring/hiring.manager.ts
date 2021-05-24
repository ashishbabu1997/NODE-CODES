import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import hiringQuery from './query/hiring.query';
import * as emailClient from '../emailService/emailService';
import { createNotification } from '../common/notifications/notifications';
import config from '../config/config'


// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for listing all position hiring steps
export const getPositionHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                var result=await client.query(queryService.positionHiringStepsQuery(_body));
                resolve({ code: 200, message: "Position hiring steps listed successfully", data: result.rows  });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for listing hiring steps of a single candidate
export const getCandidateHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                var result=await client.query(queryService.candidateHiringStepsQuery(_body));
                var candidatePositionResult=await client.query(queryService.candidatePositionDetailsQuery(_body));                
                resolve({ code: 200, message: "Candidate client hiring steps listed successfully", data: {hiringSteps:result.rows,commonData : candidatePositionResult.rows[0] } });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for listing all position hiring steps of a single candidate
export const getAllCandidateHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                if(_body.userRoleId==1)
                {
                    var result=await client.query(queryService.candidateAllPositionHiringStepsQuery(_body));
                    resolve({ code: 200, message: "Candidate client hiring steps for all positions listed successfully", data: result.rows });
                }
                else
                {
                    var results=await client.query(queryService.candidateAllPositionHiringStepsOfHirerQuery(_body));
                    resolve({ code: 200, message: "Candidate client hiring steps for hirer's positions listed successfully", data: results.rows });
                }
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for listing default hiring steps from database
export const getDefaultHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                var result=await client.query(queryService.getDefaultHiringStepsQuery());
                resolve({ code: 200, message: "Default client  hiring steps listed successfully", data: result.rows });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for updating hiring step details for an applied candidate
export const updateHiringStepDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else
                {
                    var result=await client.query(queryService.updateHiringStepDetailsQuery(_body));
                    var candidateClientHiringStepName=result.rows[0].candidate_hiring_step_name
                    _body.candidateId=result.rows[0].candidate_id
                    _body.positionId=result.rows[0].position_id
                    let resourceAllocatedRecruiter = await client.query(queryService.getResourceAllocatedRecruiter(_body));
                    var positions=await client.query(queryService. getPositionName(_body));
                    var assignee=await client.query(queryService. getAssigneeName(_body));
                    let imageResults=await client.query(queryService.getImageDetails(_body))
                    if(candidateClientHiringStepName=='Negotiation/Close position')
                    {
                        await client.query(queryService.updateMakeOfferValue(_body));
                        
                        if (_body.hiringAssesmentValue==0)
                        {   
                            let message=`${imageResults.rows[0].candidate_first_name +' '+imageResults.rows[0].candidate_last_name} has accepted the offer by ${positions.rows[0].company_name}`
                            await createNotification({ positionId:null, jobReceivedId:null, companyId:_body.companyId, message:message, candidateId:_body.candidateId, notificationType: 'candidate',userRoleId:_body.userRoleId,employeeId:_body.employeeId,image:imageResults.rows[0].image,firstName:imageResults.rows[0].candidate_first_name,lastName:imageResults.rows[0].candidate_last_name })
                            var subj = "Resource Acceptance Notification";
                            let path = 'src/emailTemplates/resourceAcceptionMailText.html';
                            let adminReplacements = {
                                    fName: imageResults.rows[0].candidate_first_name,
                                    lName: imageResults.rows[0].candidate_last_name,
                                    cName: positions.rows[0].company_name,
                                    pName:positions.rows[0].position_name
                            }; 
                            if(resourceAllocatedRecruiter.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email,subj,path,adminReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                            if(positions.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(positions.rows[0].email,subj,path,adminReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                            let assigneePath = 'src/emailTemplates/resourceAcceptionAssigneeMailText.html';
                            let assigneeReplacements = {
                                    fName: imageResults.rows[0].candidate_first_name,
                                    lName: imageResults.rows[0].candidate_last_name,
                                    pName:positions.rows[0].position_name
                            }; 
                            if(assignee.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(assignee.rows[0].email,subj,assigneePath,assigneeReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                            await client.query(queryService.updateAvailabilityOfCandidate(_body));
                            let updatedResourceCounts=await client.query(queryService.updateClosedCount(_body))
                            if(updatedResourceCounts.rows[0].developer_count>=updatedResourceCounts.rows[0].close_count)
                            {
                                await client.query(queryService.updateJobStatus(_body))
                            }

                        }
                        else if (_body.hiringAssesmentValue==1)
                        {
                            var subject = "Resource Rejection Notification";
                            let rejectionPath = 'src/emailTemplates/resourceRejectionMailText.html';
                            let rejectionAdminReplacements = {
                                    fName: imageResults.rows[0].candidate_first_name,
                                    lName: imageResults.rows[0].candidate_last_name,
                                    cName: positions.rows[0].company_name,
                                    pName:positions.rows[0].position_name
                            }; 
                            if(resourceAllocatedRecruiter.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email,subject,rejectionPath,rejectionAdminReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                            if(positions.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(positions.rows[0].email,subject,rejectionPath,rejectionAdminReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                        }
                        else
                        {
                            var ellowSubject = "Ellow Rejection Notification";
                            let ellowRejectionAssigneePath = 'src/emailTemplates/ellowRejectionAssigneeMailText.html';
                            let ellowRejectionAssigneeReplacements = {
                                    fName: imageResults.rows[0].candidate_first_name,
                                    lName: imageResults.rows[0].candidate_last_name,
                                    pName:positions.rows[0].position_name
                            }; 
                            if(assignee.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(assignee.rows[0].email,ellowSubject,ellowRejectionAssigneePath,ellowRejectionAssigneeReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                            if(resourceAllocatedRecruiter.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email,ellowSubject,ellowRejectionAssigneePath,ellowRejectionAssigneeReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                            if(positions.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(positions.rows[0].email,ellowSubject,ellowRejectionAssigneePath,ellowRejectionAssigneeReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                        }
                    }
                    else if (candidateClientHiringStepName=='Discussion with resource')
                    {
                        var discussionWithResourceSubject = "Discussion With Resource Notification";
                        let recruitersPath = 'src/emailTemplates/recruitersDiscussionMailText.html';
                        let assigneesPath = 'src/emailTemplates/assigneeDisscussionMailText.html'
                        let ressourcesPath = 'src/emailTemplates/resourceDiscussionMailText.html';
                        let recruitersReplacements = {
                                fName: imageResults.rows[0].candidate_first_name,
                                cName: positions.rows[0].company_name,
                                pName:positions.rows[0].position_name
                        }; 
                        if(resourceAllocatedRecruiter.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email,discussionWithResourceSubject,recruitersPath,recruitersReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                            if(positions.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(positions.rows[0].email,discussionWithResourceSubject,recruitersPath,recruitersReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                        let assigneesReplacements = {
                            fName: imageResults.rows[0].candidate_first_name,
                            lName:imageResults.rows[0].candidate_last_name,
                            aName: assignee.rows[0].firstname,
                            pName:positions.rows[0].position_name,
                            pcName:positions.rows[0].company_name
                        }; 
                        if(assignee.rows[0].email!=null || '' || undefined)
                            {
                                emailClient.emailManager(assignee.rows[0].email,discussionWithResourceSubject,assigneesPath,assigneesReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                        let resourcesReplacements = {
                            fName: imageResults.rows[0].candidate_first_name,
                            cName: positions.rows[0].company_name,
                            aName: assignee.rows[0].firstname,
                            pName:positions.rows[0].position_name
                    }; 
                    if(imageResults.rows[0].email_address!=null || '' || undefined)
                            {
                                emailClient.emailManager(imageResults.rows[0].email_address,discussionWithResourceSubject,ressourcesPath,resourcesReplacements);
                            }
                            else
                            {
                                console.log("Email Recipient is empty")
                            } 
                    }
                    else
                    {
                        var makeOfferSubject = "Offer of Recruitment";
                        let recruiterOfferPath = 'src/emailTemplates/makeOfferMailText.html';
                        let recruiterOfferReplacements = {
                                fName: imageResults.rows[0].candidate_first_name,
                                aName:assignee.rows[0].firstname,
                                pName:positions.rows[0].position_name,
                                cName:positions.rows[0].company_name
                        }; 
                        if(resourceAllocatedRecruiter.rows[0].email!=null || '' || undefined)
                        {
                            emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email,makeOfferSubject,recruiterOfferPath,recruiterOfferReplacements);
                        }
                        else
                        {
                            console.log("Email Recipient is empty")
                        }
                        if(positions.rows[0].email!=null || '' || undefined)
                        {
                            emailClient.emailManager(positions.rows[0].email,makeOfferSubject,recruiterOfferPath,recruiterOfferReplacements);
                        }
                        else
                        {
                            console.log("Email Recipient is empty")
                        }
                    }
                    resolve({ code: 200, message: "Hiring step details updated successfully", data: {} });
                }
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction to move hiring stage of a candidate
export const moveCandidateHiringStep = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else
                {
                    var positions=await client.query(queryService. getPositionName(_body));
                    var positionName=positions.rows[0].position_name
                    var companies=await client.query(queryService.getCompanyName(_body));
                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getHirerAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} (${companyName}) has moved the candidate ${_body.candidateName} to ${_body.candidateHiringStepName} for the position ${positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body))
                    await client.query(queryService.moveCandidateHiringStepQuery(_body)); 
                    _body.assigneeComment=`${assigneeName} has moved the candidate to ${_body.candidateHiringStepName}`
                    await client.query(queryService.updateAssigneeComments(_body));
                    await client.query(queryService.updateCurrentStage(_body)); 
                    resolve({ code: 200, message: "Hiring step moved successfully", data: {} });
                }
               
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for rejectiong any candidate from hiring process
export const rejectFromHiringProcess = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else
                {
                    _body.hiringStepName = 'Rejected';
                    var positions=await client.query(queryService. getPositionName(_body));
                    var positionName=positions.rows[0].position_name
                    var companies=await client.query(queryService.getCompanyName(_body));
                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} (${companyName}) has rejected the candidate ${_body.candidateName} at  ${_body.hiringStepName} for the position ${positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body));
                    await client.query(queryService.rejectFromHiringProcess(_body));
                    await client.query(queryService.updateCurrentStage(_body)); 
                    resolve({ code: 200, message: "Rejected candidate succesfully", data: {} });
            }
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction to add a new hiring stage 
export const addNewStageForCandidate = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else{
                    var positions=await client.query(queryService. getPositionName(_body));
                    var positionName=positions.rows[0].position_name
                    var companies=await client.query(queryService.getCompanyName(_body));
                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} (${companyName}) has added a new step named  ${_body.candidateHiringStepName}  for  the candidate ${_body.candidateName} who applied for the  position ${positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body));
                    await client.query(queryService.addNewStageForCandidate(_body));
                    resolve({ code: 200, message: "Added new stage succesfully", data: {} });
                }
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for adding assignee to a candidate
export const updateDefaultAssignee = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else{
                    var positions=await client.query(queryService. getPositionName(_body));
                    console.log("Positions",positions)
                    var positionName=positions.rows[0].position_name
                    var companies=await client.query(queryService.getCompanyName(_body));
                    console.log("Companies",companies)

                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getAssigneeName(_body));
                    console.log("names",names)
                    let assigneeName=names.rows[0].firstname
                    let resourceAllocatedRecruiter = await client.query(queryService.getResourceAllocatedRecruiter(_body));
                    console.log("recruiters",resourceAllocatedRecruiter)

                    _body.auditLogComment=`${assigneeName} (${companyName}) is the assignee for the  position ${positionName}`
                    
                    let subject='Client Screening Assignee Notification'
                    let path = 'src/emailTemplates/clientScreeningAssigneeText.html';
                    let recruitersPath = 'src/emailTemplates/clientScreeningRecruitersText.html' 
                    let recruiterReplacements ={
                        aName:names.rows[0].firstname,
                        cName:_body.candidateName,
                        pName:positionName,
                        cpName:companyName
                    };
                    let replacements ={
                        aName:names.rows[0].firstname,
                        cName:_body.candidateName
                    };
                  console.log("MAILS",names.rows[0].email,positions.rows[0].email,resourceAllocatedRecruiter.rows[0].email)
                emailClient.emailManager(names.rows[0].email,subject,path,replacements);
                emailClient.emailManager(positions.rows[0].email,subject,recruitersPath,recruiterReplacements);
                await client.query(queryService.insertAuditLogForHiring(_body));
                await client.query(queryService.updateDefaultAssigneeQuery(_body));
                if(positions.rows[0].email!=null)
                {
                    emailClient.emailManager(resourceAllocatedRecruiter.rows[0].email,subject,recruitersPath,recruiterReplacements);

                }
                else{
                    console.log("No ellow recruiters assigned to this candidate")
                }
                resolve({ code: 200, message: "Updated assignee succesfully", data: {} });
                }
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for deleting a hiring step from processing
export const deletePositionHiringStep = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                    console.log("h",_body.positionHiringStepId)
                    await client.query(queryService.deletePositionHiringStep(_body));
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let employeeName=names.rows[0].firstname
                    
                    _body.auditLogComment=`${employeeName} has deleted the step ${_body.positionHiringStepName} for the  position ${_body.positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body));
                    resolve({ code: 200, message: "Deleted Hiring Step succesfully", data: {} });
                
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for reordering steps from  the listed hiring steps
export const reorderHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                let candidateHiringStepQueries = [];
                if(![null,undefined,''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps))
                {
                    let order = 1;
                    _body.hiringSteps.forEach(element => {
                        const insertHiringStepsQuery = {
                            name: 'add-hiring-steps',
                            text: hiringQuery.updateCandidateHiringStepOrder,
                            values: [element.candidateHiringStepId,order,Date.now()],
                        }
                        candidateHiringStepQueries.push(client.query(insertHiringStepsQuery));
                        order++;
                    });   
                }
                await Promise.all(candidateHiringStepQueries);
                await client.query('COMMIT')
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


