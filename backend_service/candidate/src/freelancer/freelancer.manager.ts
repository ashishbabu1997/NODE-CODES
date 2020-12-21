import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import * as emailClient from '../emailService/emailService';
import config from '../config/config'
import { createNotification } from '../common/notifications/notifications';
import freelancerQuery from './query/freelancer.query';



export const listJobs = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let filterQuery='',queryValues={search:'%%'};
                
                if(![null,undefined,''].includes(_body.filterSkillId))
                {
                    filterQuery='HAVING $skillid = ANY(ARRAY_AGG(s.skill_id))'
                    queryValues = Object.assign({skillid:_body.filterSkillId},queryValues)
                }

                if(![null,undefined,''].includes(_body.searchKey))
                {
                    queryValues.search = '%'+_body.searchKey+'%';
                }
                let result =await client.query(queryService.listJobPositions(filterQuery,queryValues));
                
                await client.query('COMMIT');
                resolve({ code: 200, message: "Freelancer jobs listed successfully", data: result.rows });
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

export const modifyGeneralInfo = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query(queryService.modifyCandidateProfileDetailsQuery(_body));
                await client.query(queryService.modifyCandidateAvailabilityQuery(_body));
                await client.query(queryService.addWorkExperiences(_body));
                
                resolve({ code: 200, message: "Freelancer General info updated successfully", data: {} });
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

export const modifyOtherInfoAndSubmit = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                _body.candidateStatus = 9; 
                
                _body.idSet = Array.isArray(_body.cloudProficiency)?_body.cloudProficiency.map(a => a.cloudProficiencyId).filter(Number):false;
                if(_body.idSet)
                {
                    await client.query(queryService.deleteCandidateCloudQuery(_body));
                    await client.query(queryService.insertCandidateCloudQuery(_body));
                }
                
                await client.query(queryService.modifySocialProfileAndStatusUpdate(_body));
                await client.query(queryService.candidateStatusUpdate(_body));
                await client.query('COMMIT'); 
                
                resolve({ code: 200, message: "Freelancer other info updated and finished successfully", data: {} });
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

export const submitFreelancerProfile = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                _body.candidateStatus = 3; 
                // await client.query(queryService.addDefaultTraits(_body));
                // await client.query(queryService.addSkillRelatedTraits(_body));
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
                let message=`${firstName + ' ' + lastName} has submitted his profile for review`
                await createNotification({ positionId:null, jobReceivedId:null, companyId:_body.companyId, message:message, candidateId:_body.candidateId, notificationType: 'freelancer',userRoleId:_body.userRoleId,employeeId:_body.employeeId,image:imageResults.rows[0].image,firstName:imageResults.rows[0].candidate_first_name,lastName:imageResults.rows[0].candidate_last_name })
                emailClient.emailManager(config.adminEmail,config.text.submitProfileSubject,path,replacements);
                resolve({ code: 200, message: "Freelancer submitted successfully", data: {} });
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



export const getFreelancerStatus = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
             
                var result=await client.query(queryService.getCandidateStatuses(_body));
                resolve({ code: 200, message: "Candidate status listed successfully", data: {data:result.rows[0]} });
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

export const getPositionDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
             
                var result=await client.query(queryService.getDetailsPosition(_body));
                resolve({ code: 200, message: "Candidate positions details listed successfully", data:result.rows });
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