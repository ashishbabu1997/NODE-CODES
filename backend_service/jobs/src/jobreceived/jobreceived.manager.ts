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

export const updateflagForJobReceived = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-position-flag',
            text: jobReceivedQuery.updateFlag,
            values: [_body.jobReceivedId, _body.companyId, _body.flag, _body.employeeId, currentTime]
        }
        
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Flag updated successfully", data: {} });
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
export const editCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                console.log("values : ", [_body.candidates.candidateId, _body.candidates.firstName, _body.candidates.lastName, _body.candidates.email, _body.candidates.phoneNumber, _body.candidates.rate, _body.candidates.billingTypeId, _body.candidates.resume, _body.candidates.currencyTypeId, _body.candidates.coverNote, _body.candidates.candidateStatus, _body.candidates.workExperience, _body.candidates.companyId]);
                const editQuery = {
                    name: 'update-JobReceived-reject',
                    text: jobReceivedQuery.editDetailsCandidate,
                    values: [_body.candidates.candidateId, _body.candidates.firstName, _body.candidates.lastName, _body.candidates.email, _body.candidates.phoneNumber, _body.candidates.rate, _body.candidates.billingTypeId, _body.candidates.resume, _body.candidates.currencyTypeId, _body.candidates.coverNote, _body.candidates.candidateStatus, _body.candidates.workExperience, _body.candidates.companyId]
                }
                var candidateId=_body.candidates.candidateId
                await client.query(editQuery)
                let skillSet = ![undefined, null].includes(_body.skills) ? _body.skills.map(a => a.skill.skillId) :[];                                
                const deleteCandidateSkillsQuery = {
                    name: 'delete-candidate-skills',
                    text: jobReceivedQuery.deleteCandidateSkills,
                    values: [_body.candidates.candidateId, skillSet],
                }
                await client.query(deleteCandidateSkillsQuery)
                if (Array.isArray(_body.skills))
                {
                    let promise=[];
                    _body.skills.forEach(element => { 
                        var competency=element.competency
                        var preffered=element.preffered
                        var skillId=element.skill["skillId"]
                        var yearsOfExperience=element.yoe
                        const addSkills = {
                            name: 'add-top-job-skills',
                            text: jobReceivedQuery.addCandidateSkills,
                            values: [candidateId, skillId,competency,preffered,yearsOfExperience, true, currentTime, _body.employeeId],
                        }
                        promise.push(client.query(addSkills))
                    });
                    await Promise.all(promise);
                }
                if (_body.candidateStatus == 3) {
                    const addDefaultTraits = {
                        name: 'add-default-traits',
                        text: jobReceivedQuery.addDefaultAssessmentTraits,
                        values: [_body.candidates.candidateId, _body.employeeId, currentTime],
                    }
                    await client.query(addDefaultTraits);
                    
                    const addSkillRelatedTraits = {
                        name: 'add-skill-based-traits',
                        text: jobReceivedQuery.addSkillBasedAssesmentTraits,
                        values: [_body.candidates.candidateId, _body.employeeId, currentTime],
                    }
                    await client.query(addSkillRelatedTraits);
                }
                
                resolve({ code: 200, message: "Candidate profile updated successfully", data: {} });
                
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

export const saveCandidateProfiles = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const candidatesDetails = _body.candidates;
                let candidates = [candidatesDetails.firstName, candidatesDetails.lastName, candidatesDetails.companyId, candidatesDetails.jobReceivedId, candidatesDetails.coverNote,
                    candidatesDetails.rate, candidatesDetails.billingTypeId, candidatesDetails.currencyTypeId, candidatesDetails.email, candidatesDetails.phoneNumber, candidatesDetails.resume,
                    currentTime, currentTime, _body.employeeId, _body.employeeId, candidatesDetails.candidateStatus, candidatesDetails.workExperience]
                    
                    console.log("candidatesDetails : ", candidates);
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
                            values: [_body.positionId, candidateId, candidatesDetails.jobReceivedId, candidatesDetails.billingTypeId, candidatesDetails.currencyTypeId, _body.employeeId, currentTime],
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
                            values: [candidatesDetails.jobReceivedId, jobStatus, candidatesDetails.companyId, _body.employeeId, currentTime],
                        }
                        await client.query(updateCompanyJobStatusQuery);
                    }
                    
                    
                    let tSkill = (![undefined, null].includes(_body.skills) && Array.isArray(_body.skills["topRatedSkill"])) ? _body.skills["topRatedSkill"].map(a => a.skillId) : [];
                    let oSkill = (![undefined, null].includes(_body.skills) && Array.isArray(_body.skills["otherSkill"])) ? _body.skills["otherSkill"].map(a => a.skillId) : [];
                    
                    if (tSkill.length > 0) {
                        const addTopSkillsQuery = {
                            name: 'add-top-job-skills',
                            text: jobReceivedQuery.addCandidateSkills,
                            values: [candidateId, tSkill, true, currentTime, _body.employeeId],
                        }
                        await client.query(addTopSkillsQuery);
                    }
                    if (oSkill.length > 0) {
                        const addOtherSkillsQuery = {
                            name: 'add-other-job-skills',
                            text: jobReceivedQuery.addCandidateSkills,
                            values: [candidateId, oSkill, false, currentTime, _body.employeeId],
                        }
                        await client.query(addOtherSkillsQuery);
                    }
                    const updateQuery = {
                        name: 'get-position-details',
                        text: jobReceivedQuery.getPositionName,
                        values: [_body.positionId],
                    }   
                    var positionDetail=await client.query(updateQuery);
                    var positionName=positionDetail.rows[0].position
                    if (candidatesDetails.candidateStatus == 3) {
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
                    }
                    
                    await client.query('COMMIT');
                    var candidateFirstName=candidatesDetails.firstName
                    var candidateLastName=candidatesDetails.lastName
                    const message = `A new candidate named ${candidateFirstName + ' ' + candidateLastName} has been added for the position ${positionName} `
                    await createNotification({ positionId:_body.positionId, jobReceivedId:candidatesDetails.jobReceivedId, companyId: _body.companyId, message, candidateId:candidatesDetails.candidateId, notificationType: 'position' })
                    resolve({ code: 200, message: "Candidate profiles added", data: {} });
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
            if (_body.companyId) {
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
            }
            else {
                
                const listJobCandidatesQuery = {
                    name: 'get-Profile',
                    text: selectQuery,
                    values: [parseInt(_body.jobReceivedId)]
                }
                
                database().query(listJobCandidatesQuery, (error, results) => {
                    if (error) {
                        console.log(error)
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return;
                    }
                    resolve({ code: 200, message: "Profile listed successfully", data: { profile: results.rows } });
                })
            }
            
        })
    }
    export const saveCandidateProfile = (_body) => {
        return new Promise((resolve, reject) => {
            const currentTime = Math.floor(Date.now() / 1000);
            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    const candidatesDetails = _body.candidates;
                    let candidates = [candidatesDetails.firstName, candidatesDetails.lastName, candidatesDetails.companyId, candidatesDetails.jobReceivedId, candidatesDetails.coverNote,
                        candidatesDetails.rate, candidatesDetails.billingTypeId, candidatesDetails.currencyTypeId, candidatesDetails.email, candidatesDetails.phoneNumber, candidatesDetails.resume,
                        currentTime, currentTime, _body.employeeId, _body.employeeId, candidatesDetails.candidateStatus, candidatesDetails.workExperience]
                        
                        console.log("candidatesDetails : ", candidates);
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
                                values: [_body.positionId, candidateId, candidatesDetails.jobReceivedId, candidatesDetails.billingTypeId, candidatesDetails.currencyTypeId, _body.employeeId, currentTime],
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
                                values: [candidatesDetails.jobReceivedId, jobStatus, candidatesDetails.companyId, _body.employeeId, currentTime],
                            }
                            await client.query(updateCompanyJobStatusQuery);
                        }
                        
                        if (Array.isArray(_body.skills))
                        {
                            let promise=[];
                            _body.skills.forEach(element => {
                                
                                var competency=element.competency
                                var preffered=element.preffered
                                var skillId=element.skill["skillId"]
                                var yearsOfExperience=element.yoe
                                const addSkills = {
                                    name: 'add-top-job-skills',
                                    text: jobReceivedQuery.addCandidateSkills,
                                    values: [candidateId, skillId,competency,preffered,yearsOfExperience, true, currentTime, _body.employeeId],
                                }
                                promise.push(client.query(addSkills))
                            });
                            await Promise.all(promise);
                        }
                        const updateQuery = {
                            name: 'get-position-details',
                            text: jobReceivedQuery.getPositionName,
                            values: [_body.positionId],
                        }   
                        var positionDetail=await client.query(updateQuery);
                        var positionName=positionDetail.rows[0].position
                        if (candidatesDetails.candidateStatus == 3) {
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
                        } 
                        await client.query('COMMIT');
                        var candidateFirstName=candidatesDetails.firstName
                        var candidateLastName=candidatesDetails.lastName
                        const message = `A new candidate named ${candidateFirstName + ' ' + candidateLastName} has been added for the position ${positionName} `
                        await createNotification({ positionId:_body.positionId, jobReceivedId:candidatesDetails.jobReceivedId, companyId: _body.companyId, message, candidateId:candidatesDetails.candidateId, notificationType: 'position' })
                        resolve({ code: 200, message: "Candidate profiles added", data: {} });
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
        