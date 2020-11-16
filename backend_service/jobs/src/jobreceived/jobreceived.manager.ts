import jobReceivedQuery from './query/jobreceived.query';
import database from '../common/database/database';
import * as format from 'pg-format';
import { createNotification } from '../common/notifications/notifications';
import { ENETUNREACH } from 'constants';

export const getAllJobReceived = (_body) => {
    
    return new Promise((resolve, reject) => {
        
        var selectQuery = jobReceivedQuery.getAllJobReceived;
        
        if (_body.filter) {
            selectQuery = selectQuery + " AND (LOWER(position_name ) LIKE '%" + _body.filter.toLowerCase() + "%' OR LOWER(company_name ) LIKE '%" + _body.filter.toLowerCase() + "%') "
        }
        const orderBy = {
            "position": 'p.position_id',
            "positionName": 'p.position_name',
            "companyName": 'c.company_name',
            "createdOn":'jr.created_on',
            "candidateCount":'"candidateCount"',
            "resourceCount":'p.developer_count',
            "duration":'p.contract_duration',
            "startDate":'p.contract_start_date'
        }
        
        if(_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy))  
        {
            selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
        }
        
        if (_body.limit && _body.skip) {
            selectQuery = selectQuery + ' LIMIT ' + _body.limit + ' OFFSET ' + _body.skip;
        }
        const query = {
            name: 'get-AllActivePositions',
            text: selectQuery,
            values: [_body.companyId,_body.employeeId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            console.log(results.rows)
            resolve({ code: 200, message: "Job Received listed successfully", data: { Jobs: results.rows } });
        })
    })
}

export const getJobReceivedByJobReceivedId = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-JobReceivedByJobReceivedId',
            text: jobReceivedQuery.getJobReceivedById,
            values: [parseInt(_body.jobReceivedId), parseInt(_body.companyId)]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Job Received listed successfully", data: results.rows[0] });
        })
    })
}

export const updateIsRejectForJobReceived = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-JobReceived-reject',
            text: jobReceivedQuery.updateReject,
            values: [_body.jobReceivedId, _body.companyId, _body.reject, _body.employeeId, currentTime]
        }
        
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "IsReject updated successfully", data: {} });
        })
    })
}

export const getProfileByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery=jobReceivedQuery.getProfile
        const orderBy = {
            "candidateFirstName": 'ca.candidate_first_name',
        }
        
        if(_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy))  
        {
            selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
        }
            const query = {
                name: 'get-ProfileByCompanyId',
                text: selectQuery,
                values: [parseInt(_body.companyId), parseInt(_body.positionId)]
            }
            
            database().query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Profile listed successfully", data: { profile: results.rows } });
            })
        
    })
}
export const saveCandidateProfile = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                let sellerCompanyId = _body.userRoleId==1?_body.sellerCompanyId:_body.companyId;
                let candidates = [_body.firstName, _body.lastName, sellerCompanyId, _body.jobReceivedId, _body.description, _body.email, _body.phoneNumber, currentTime, currentTime, _body.employeeId, _body.employeeId, 4, _body.image, _body.citizenship, _body.residence,_body.positionName]    
                const saveCandidateQuery = {
                    name: 'add-Profile',
                    text: format(jobReceivedQuery.addProfile, [candidates]),
                }
                var addCandidateResult = await client.query(saveCandidateQuery);
                let candidateId = addCandidateResult.rows[0].candidate_id;
                if (![null, undefined, ''].includes(_body.positionId)) {
                    const addPositionQuery = {
                        name: 'add-position',
                        text: jobReceivedQuery.addCandidatePosition,
                        values: [_body.positionId, candidateId, _body.jobReceivedId, _body.billingTypeId, _body.currencyTypeId, _body.employeeId, currentTime],
                    }
                    await client.query(addPositionQuery);
                    
                    const getJobStatusQuery = {
                        name: 'get-Job-status',
                        text: jobReceivedQuery.getJobStatus,
                        values: [_body.positionId],
                    }
                    const response = await client.query(getJobStatusQuery);
                    let jobStatus = response.rows[0].jobStatus;
                    
                    const updateCompanyJobStatusQuery = {
                        name: 'update-company-job-status',
                        text: jobReceivedQuery.updateCompanyJobStatus,
                        values: [_body.jobReceivedId, jobStatus, sellerCompanyId, _body.employeeId, currentTime],
                    }
                    await client.query(updateCompanyJobStatusQuery);
                }

                await client.query('COMMIT');
                resolve({ code: 200, message: "Candidate profile added", data: {candidateId} });
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

export const submitCandidateProfile = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {

                await client.query('BEGIN');
                let candidateId = _body.candidateId;
                const updateCandidateStatus = {
                    name: 'update-candidate-status',
                    text: jobReceivedQuery.updateCandidateStatus,
                    values: [candidateId, _body.employeeId, currentTime],
                }
                let result = await client.query(updateCandidateStatus);
                
                const addDefaultTraits = {
                    name: 'add-default-traits',
                    text: jobReceivedQuery.addDefaultAssessmentTraits,
                    values: [candidateId, _body.employeeId, currentTime],
                }
                await client.query(addDefaultTraits);
                const addSkillRelatedTraits = {
                    name: 'add-skill-based-traits',
                    text: jobReceivedQuery.addSkillBasedAssesmentTraits,
                    values: [candidateId, _body.employeeId, currentTime],
                }
                await client.query(addSkillRelatedTraits);
                
                await client.query('COMMIT');
                let candidateFirstName=result.rows[0].candidate_first_name;
                let candidateLastName=result.rows[0].candidate_last_name;
                let companyId = result.rows[0].company_id;
                let jobReceivedId = result.rows[0].job_received_id;
                let positionName = _body.positionName;
                
                if(![null,undefined,""].includes(_body.positionId))
                {
                    const message = `A new candidate named ${candidateFirstName + ' ' + candidateLastName} has been added for the position ${positionName} `
                    await createNotification({ positionId:_body.positionId, jobReceivedId, companyId, message, candidateId, notificationType: 'position' })    
                }
                
                resolve({ code: 200, message: "Candidate profile submitted", data: {} });
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


export const editSkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                var candidateId=_body.candidateId
                console.log(candidateId)
                let skillSet = ![undefined, null].includes(_body.skills) ? _body.skills.map(a => a.skill.skillId) :[];
                let competentSkillSet = ![undefined, null].includes(_body.skills) ? _body.skills.filter(a=> a.competency==2 || a.competency==3).map(a => a.skill.skillId) :[];
                const deleteCandidateSkillsQuery = {
                    name: 'delete-candidate-skills',
                    text: jobReceivedQuery.deleteCandidateSkills,
                    values: [candidateId, skillSet],
                }
                console.log(deleteCandidateSkillsQuery)
                await client.query(deleteCandidateSkillsQuery)
                if (Array.isArray(_body.skills))
                {
                    let promise=[];
                    _body.skills.forEach(element => { 
                        let competency=element.competency
                        let preffered=element.preferred
                        let skillId=element.skill["skillId"]
                        let yearsOfExperience=element.yoe
                        let skillVersion = element.skillVersion
                        const addSkills = {
                            name: 'add-candidate-skills',
                            text: jobReceivedQuery.addCandidateSkills,
                            values: [candidateId, skillId,competency,preffered,yearsOfExperience,skillVersion,currentTime,_body.employeeId,true],
                        }
                        promise.push(client.query(addSkills))
                    });
                    await Promise.all(promise);
                }
                
                if(_body.candidateStatus == 3)
                {
                    const deleteCandidateAssesmentTraitsQuery = {
                        name: 'delete-candidate-assessment-traits',
                        text: jobReceivedQuery.deleteCandidateAssesmentTraits,
                        values: [candidateId, competentSkillSet],
                    }
                    await client.query(deleteCandidateAssesmentTraitsQuery);
                    const addSkillRelatedTraits = {
                        name: 'add-skill-based-traits',
                        text: jobReceivedQuery.addSkillBasedAssesmentTraits,
                        values: [candidateId, _body.employeeId, currentTime],
                    }
                    await client.query(addSkillRelatedTraits);
                }
                
                
                
                resolve({ code: 200, message: "Candidate skills updated successfully", data: {} });
                
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
    // reject({ code: 400, message: "Failed. Please try again.", data: {} });
    
}