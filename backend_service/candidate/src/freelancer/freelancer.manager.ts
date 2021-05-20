import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import * as emailClient from '../emailService/emailService';
import config from '../config/config'
import { createNotification } from '../common/notifications/notifications';
import freelancerQuery from './query/freelancer.query';
import * as utils from '../utils/utils';



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
            const client = await database()
            try {
                await client.query('BEGIN');
                const  getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: freelancerQuery.getellowAdmins,
                    values: []
                    
                    
                }
                var ellowAdmins=await client.query(getEllowAdmins)
                _body.candidateStatus = 3; 
                await client.query(queryService.addDefaultTraits(_body));
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
                                        emailClient.emailManager(element.email,config.text.submitProfileSubject,path,replacements);

                                    })
                                }
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





export const listFreelancers = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                
                await client.query('COMMIT'); 
                
                resolve({ code: 200, message: "Freelancer other info updated and finished successfully", data: {} });
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
//>>>>>>>>>>>Listing all the draft freelancers from the candidates list.
export const listDraftFreelancersDetails = (_body) => {
    return new Promise((resolve, reject) => {

        var selectQuery = freelancerQuery.listDraftFreelancersFromView;
        let totalQuery = freelancerQuery.listDraftFreelancersTotalCount;
        var  queryText = '', searchQuery = '', queryValues = {}, filterQuery = '', filter = _body.body != undefined ? _body.body.filter : '',
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
                queryText = selectQuery  + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
                queryValues = Object.assign({ positionid: body.positionId, employeeid: body.employeeId }, queryValues)
                let candidateList = await client.query(queryService.listCandidates(queryText, queryValues));

                var queryCountText = totalQuery  + utils.resourceTab(body) + filterQuery + searchQuery;
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