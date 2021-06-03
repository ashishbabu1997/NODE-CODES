import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import * as emailClient from '../emailManager/emailManager';
import { createNotification } from '../common/notifications/notifications';
import config from '../config/config'

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