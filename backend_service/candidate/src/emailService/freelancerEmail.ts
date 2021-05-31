import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import * as emailClient from '../emailManager/emailManager';
import config from '../config/config'
import { createNotification } from '../common/notifications/notifications';
import * as utils from '../utils/utils';



export const submitFreelancerProfileEmail = async (_body, client) => {
    try {
                await client.query('BEGIN');
                var ellowAdmins=await client.query(queryService.getEllowAdmins());
                var result=await client.query(queryService.candidateStatusUpdate(_body));
                await client.query('COMMIT');
                var firstName=result.rows[0].candidate_first_name
                var lastName=result.rows[0].candidate_last_name
                let replacements = {
                    fName:firstName,
                    lName:lastName
                };
                let path = 'src/emailTemplates/freelancerSubmitText.html';
                let imageResults=await client.query(queryService.getImageDetails(_body))
                await client.query('COMMIT');
                let message=`${firstName + ' ' + lastName} has submitted his profile for review`
                await createNotification({ positionId:null, jobReceivedId:null, companyId:_body.companyId, message:message, candidateId:_body.candidateId, notificationType: 'freelancer',userRoleId:_body.userRoleId,employeeId:_body.employeeId,image:imageResults.rows[0].image,firstName:imageResults.rows[0].candidate_first_name,lastName:imageResults.rows[0].candidate_last_name })
                if(Array.isArray(ellowAdmins.rows))
                                {
                                   
                                    ellowAdmins.rows.forEach(element => {
                                        if (utils.notNull(element.email))
                                            emailClient.emailManager(element.email,config.text.submitProfileSubject,path,replacements);
                                        
                                       

                                    })
                                }
            } catch (e) {
            console.log("error : ",e.message)
            throw new Error('Failed to send mail');
            }
    }