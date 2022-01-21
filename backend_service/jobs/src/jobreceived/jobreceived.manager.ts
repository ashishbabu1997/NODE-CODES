import jobReceivedQuery from './query/jobreceived.query';
import database from '../common/database/database';
import * as format from 'pg-format';
import { createNotification,createHirerNotifications } from '../common/notifications/notifications';
import * as handlebars from 'handlebars'
import config from '../config/config'
import {readHTMLFile} from '../middlewares/htmlReader'
import * as emailClient from '../emailService/emailService';
import * as passwordGenerator from 'generate-password'
import * as crypto from 'crypto';
import { createImportSpecifier, ImportsNotUsedAsValues } from 'typescript';
import * as queryService from '../queryService/queryService';
import * as utils from '../utils/utils';

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all job received details of a company
export const getAllJobReceived = (_body) => {
    
    return new Promise((resolve, reject) => {
        (async () => {
            
            const client = await database()
            try {
                var selectQuery = jobReceivedQuery.getAllJobReceived;
                var totalQuery=jobReceivedQuery.getAllJobReceivedCount;
                var queryText='', queryValues={}, filterQuery='', filter=_body.body!=undefined?_body.body.filter:'',searchQuery='',body=_body.query, sort = '', searchKey = '';
                const orderBy = {
                    "position": 'p.position_id',
                    "positionName": 'p.position_name',
                    "companyName": 'c.company_name',
                    "createdOn":'p.created_on',
                    "updatedOn":'p.updated_on',
                    "candidateCount":'"candidateCount"',
                    "resourceCount":'p.developer_count', 
                    "duration":'p.contract_duration',
                    "startDate":'p.contract_start_date'
                }
                
                if(filter)
                {            
                    if(filter.submittedProfile)
                    {
                        filterQuery=filterQuery+' AND p.submittedProfile'
                        queryValues = Object.assign({submittedprofile:filter.submittedProfile})
                    }
                    if(filter.numberOfOpenings)
                    {
                        filterQuery=filterQuery+' AND p.developer_count = $openings'
                        queryValues =  Object.assign({openings:filter.numberOfOpenings},queryValues)
                    }
                    if(filter.positionStatus)
                    {  
                        filterQuery=filterQuery+' AND p.job_status=$positionstatus'
                        queryValues=Object.assign({positionstatus:filter.positionStatus},queryValues)
                    }
                    if(filter.duration)
                    {
                        filterQuery=filterQuery+' AND p.contract_duration= $duration'
                        queryValues=Object.assign({duration:filter.duration},queryValues)
                    }
                    if(filter.durationStart && filter.durationEnd)
                    {
                        filterQuery=filterQuery+' AND p.contract_duration BETWEEN $durationstart AND $durationend'
                        queryValues=Object.assign({durationstart:filter.durationStart,durationend:filter.durationEnd},queryValues)
                    }
                }
                
                if(![undefined,null,''].includes(body.filter))
                {
                    searchKey='%' + body.filter + '%';
                    searchQuery = " AND (position_name ILIKE $searchkey OR company_name ILIKE $searchkey) "
                    queryValues=Object.assign({searchkey:searchKey},queryValues)
                }
                
                if(body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy))  
                {
                    sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;
                }
                _body.queryText = selectQuery +utils.jobsTab(body)+ filterQuery + searchQuery + sort + utils.jobsPagination(body);
                _body.queryCountText = totalQuery +utils.jobsTab(body)+  filterQuery + searchQuery ;
                _body.queryValues =  Object.assign({companyid:body.companyId,employeeid:body.employeeId},queryValues)
                let results = await client.query(queryService.getJobRecievedQuery(_body))
                let count = await client.query(queryService.getJobRecievedCountQuery(_body))  
                let totalCount=count.rows[0].totalCount
                let Jobs = results.rows;
                if(Array.isArray(Jobs))
                Jobs = results.rows.filter(element => element.jobStatus != 8 || element.totalCount != 0)
                resolve({ code: 200, message: "Job Received listed successfully", data: { Jobs,totalCount:totalCount} });   
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
//>>>>>>>>>>>>>>>>>>Get all job received details using job received id
export const getJobReceivedByJobReceivedId = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            
            const client = await database().connect()
            try {
                let results=await client.query(queryService.getJobReceivedByIdQuery(_body))  
                console.log(results.rows)
                resolve({ code: 200, message: "Job Received listed successfully", data: results.rows[0] });
                
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



// // >>>>>>> FUNC. >>>>>>> 
// //>>>>>>>>>>>>>>>>>>Update job received status of a user company
// export const updateIsRejectForJobReceived = (_body) => {
//     return new Promise((resolve, reject) => {
//         (async () => {
            
//             const client = await database().connect()
//             try {
//                 await client.query(queryService.updateJobReceivedRejectQuery(_body))
//                 resolve({ code: 200, message: "IsReject updated successfully", data: {} });
//             } catch (e) {
//                 console.log(e)
//                 await client.query('ROLLBACK')
//                 reject({ code: 400, message: "Failed. Please try again.", data: e.message });
//             } finally {
//                 client.release();
//             }
//         })().catch(e => {
//             reject({ code: 400, message: "Failed. Please try again.", data: e.message })
//         })
//     })
// }


// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Fetch profile details of a company by using company id
export const getProfileByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            
            const client = await database().connect()
            try {
                _body.selectQuery=jobReceivedQuery.getProfile
                const orderBy = {
                    "candidateFirstName": 'ca.candidate_first_name',
                }
                
                if(_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy))  
                {
                    _body.selectQuery = _body.selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
                }
                else
                {
                    console.log("No sorting or ordering")
                }
                let results=await client.query(queryService.getProfileByCompanyIdQuery(_body))
                resolve({ code: 200, message: "Profile listed successfully", data: { profile: results.rows } });
                
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
//>>>>>>>>>>>>>>>>>>Save the candidate profile details
export const saveCandidateProfile = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var results= await client.query(queryService.checkEMailExistenceQuery(_body))
                await client.query('COMMIT');
                if (results.rowCount==1)
                {
                    reject({ code: 400, message: "Candidate already registered", data: {} });
                    
                }
                else
                {
                    _body.sellerCompanyId = _body.userRoleId==1?_body.sellerCompanyId:_body.companyId;
                    _body.candidates = [_body.firstName, _body.lastName, _body.sellerCompanyId, _body.description, _body.email, _body.phoneNumber, currentTime, currentTime, _body.employeeId, _body.employeeId, 4, _body.image, _body.citizenship, _body.residence,_body.candidatePositionName]    
                    var addCandidateResult =await client.query(queryService.saveCandidateQuery(_body))
                    _body.candidateId = addCandidateResult.rows[0].candidate_id;
                    var companyResults = await client.query(queryService.getCompanyName(_body))
                    var companyName=companyResults.rows[0].company_name
                    if (_body.userRoleId==1 &&companyName=='Freelancer')
                    {
                        console.log("SAVING CANDIDATE TO EMPLOYEE",companyName,_body.candidateId,_body.email,_body.sellerCompanyId )
                        var employeeResult= await client.query(queryService.addEmployee(_body))
                        const addCandidateEmployee = {
                            name: 'add-candidate-employee',
                            text: jobReceivedQuery.addCandidateEmployeeDetails,
                            values:[employeeResult.rows[0].employee_id,addCandidateResult.rows[0].candidate_id,true,currentTime, currentTime]   
                        }
                        await client.query(addCandidateEmployee);
                    }
                    else
                    {
                        console.log("NOt a freelancer")
                    }
                    if (![null, undefined, ''].includes(_body.positionId)) {
                        
                        await client.query(queryService.addPositionQuery(_body))
                        const response = await client.query(queryService.getJobStatusQuery(_body))
                        _body.jobStatus = response.rows[0].jobStatus;                        
                        await client.query('COMMIT');
                        
                    }
                    else
                    {
                        console.log("Added")
                    }
                    let candidateId=_body.candidateId
                    resolve({ code: 200, message: "Candidate profile added", data: {candidateId} });
                }
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



// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Save the candidate profile details
export const resumeBuilderProfile = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var results= await client.query(queryService.checkEMailExistenceQuery(_body))
                if (results.rowCount==1)
                {
                    reject({ code: 400, message: "Candidate already registered", data: {} });
                    
                }
                else
                {
                    _body.sellerCompanyId = _body.userRoleId==1?_body.sellerCompanyId:_body.companyId;
                    _body.candidates = [_body.firstName, _body.lastName, _body.sellerCompanyId, _body.description, _body.email, _body.phoneNumber, currentTime, currentTime, _body.employeeId, _body.employeeId, 4, _body.image, _body.citizenship, _body.residence,_body.candidatePositionName]    
                    var addCandidateResult =await client.query(queryService.saveCandidateQuery(_body))
                    _body.candidateId = addCandidateResult.rows[0].candidate_id;
                    var companyResults = await client.query(queryService.getCompanyName(_body))
                    var companyName=companyResults.rows[0].company_name
                    if (_body.userRoleId==1 &&companyName=='Freelancer')
                    {
                        var employeeResult= await client.query(queryService.addEmployee(_body))
                        const addCandidateEmployee = {
                            name: 'add-candidate-employee',
                            text: jobReceivedQuery.addCandidateEmployeeDetails,
                            values:[employeeResult.rows[0].employee_id,addCandidateResult.rows[0].candidate_id,true,currentTime, currentTime]   
                        }
                        await client.query(addCandidateEmployee);
                    }
                    else
                    {
                        console.log("Not a freelancer")
                    }
                    if (![null, undefined, ''].includes(_body.positionId)) {
                        
                        await client.query(queryService.addPositionQuery(_body))
                        const response = await client.query(queryService.getJobStatusQuery(_body))
                        _body.jobStatus = response.rows[0].jobStatus;
                        await client.query('COMMIT');
                        
                    }
                    else
                    {
                        console.log("Added")
                    }
                    let candidateId=_body.candidateId
                    _body.remoteWorkExperience===""?null:_body.remoteWorkExperience
                    await client.query(queryService.addWorkExperiences(_body));
                    await client.query(queryService.modifyCandidateAvailabilityQuery(_body));
                    await client.query('COMMIT');
                    resolve({ code: 200, message: "Candidate profile added", data: {candidateId} });
                }
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
// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Submit the candidate profile by sending a notificatin mail to the admin
export const submitCandidateProfile = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let candidateId = _body.candidateId;
                let result =  await client.query(queryService.updateCandidateStatus(_body))
                let candidateFirstName=result.rows[0].candidate_first_name;
                let candidateLastName=result.rows[0].candidate_last_name;
                _body.emailAddress=result.rows[0].email_address;
                _body.sellerCompanyId = result.rows[0].company_id;
                let positionName = _body.positionName;
                var companyResults = await client.query(queryService.getCompanyName(_body))
                _body.companyType=companyResults.rows[0].company_type
                let companyId=  _body.sellerCompanyId 
                if (_body.userRoleId==1)
                {
                    await client.query(queryService.changeCandidateAssignee(_body));
                    var checkAssessment=await client.query(queryService.checkAssessment(_body));
                    _body.currentEllowStage=2,_body.reviewStepsId=6;
                    _body.ellowRecruitmentStatus=config.ellowRecruitmentStatus.complete      

                    if (checkAssessment.rowCount==0)
                    {
                        await client.query(queryService.addDefaultTraits(_body));
                        await client.query(queryService.updateProfileReviewByAdmin(_body));

                    }
                    else
                    {
                        await client.query(queryService.updateProfileReview(_body));
                    }
                    await client.query(queryService.updateEllowRecruitmentStatus(_body));

                    if(_body.companyType==2)
                    {
                        var companyCheckResults = await client.query(queryService.companyCheck(_body));
                        var data = companyCheckResults.rows[0]
                        _body.firstName = data.candidate_first_name
                        _body.lastName = data.candidate_last_name
                        _body.sellerCompanyId = data.company_id
                        _body.email = data.email_address
                        _body.phoneNumber = data.phone_number
                        var results = await client.query(queryService.verifyCandidateInCandidateEmployee(_body));
                        if (results.rowCount == 0) {
                                    const password = passwordGenerator.generate({
                                        length: 10,
                                        numbers: true
                                    });
                                    _body.hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                                    var employeeResult = await client.query(queryService.addEmployeeByAdmin(_body))
                                    _body.candidateEmployeeId = employeeResult.rows[0].employee_id
                                    await client.query(queryService.addCandidateEmployee(_body))
                                    var userSubject = "ellow.io  Login Credentials"
                                    let userPath = 'src/emailTemplates/freelancerLoginText.html';
                                    var userCredentialReplacements = {
                                        name: _body.firstName,
                                        user: _body.email,
                                        password: password
                                    };
                                    emailClient.emailManagerForNoReply(_body.email, userSubject, userPath, userCredentialReplacements)
                        }
                    }
                }
                await client.query('COMMIT');
                var subject='Candidate Addition Notification'
                if(![null,undefined,""].includes(_body.positionId))
                {
                 
                    const message = `A new candidate, ${candidateFirstName + ' ' + candidateLastName} has been submitted for the position ${positionName} `
                    await createHirerNotifications({ positionId:_body.positionId,companyId:_body.sellerCompanyId , message, candidateId, notificationType: 'candidate',userRoleId:_body.userRoleId,employeeId:_body.employeeId })   
                    await createNotification({ positionId:_body.positionId,companyId , message, candidateId, notificationType: 'candidate',userRoleId:_body.userRoleId,employeeId:_body.employeeId })   
                    let path = 'src/emailTemplates/candidateAdditionText.html';
                    var userReplacements =  {
                        first:candidateFirstName,
                        last:candidateLastName,
                        position:positionName,
                    };
                    const  getEllowAdmins = {
                        name: 'get-ellow-admin',
                        text: jobReceivedQuery.getellowAdmins,
                        values: []
                
    
                }
                var ellowAdmins=await client.query(getEllowAdmins)
                if(Array.isArray(ellowAdmins.rows))
                {
                    
                    ellowAdmins.rows.forEach(element => {
                        
                            emailClient.emailManagerForNoReply(element.email,subject,path,userReplacements);
                       
                                
                        })
                            
                }
                else{
                    console.log("Error in fetch admin query")
                }
                    var positions=await client.query(queryService. getPositionName(_body));
                    var resourceAllocatedRecruiter = await client.query(queryService.getResourceAllocatedRecruiter(_body));
                    if (_body.userRoleId==1)
                    {
                        
                            emailClient.emailManagerForNoReply(_body.emailAddress,subject,path,userReplacements);
                       
                        
                            emailClient.emailManagerForNoReply(positions.rows[0].email,subject,path,userReplacements);
                        
                
                        
                        
                    }
                    else{
                      
                            emailClient.emailManagerForNoReply(_body.emailAddress,subject,path,userReplacements);
                            emailClient.emailManagerForNoReply(positions.rows[0].email,subject,path,userReplacements);
                            emailClient.emailManagerForNoReply(resourceAllocatedRecruiter.rows[0].email,subject,path,userReplacements);
                       
                        
                        
                    }
                }
                else
                {
                    const message = `A new candidate, ${candidateFirstName + ' ' + candidateLastName} has been submitted for veting `
                    await createNotification({ positionId:_body.positionId, companyId , message, candidateId, notificationType: 'candidate',userRoleId:_body.userRoleId,employeeId:_body.employeeId })   
                    var status='vetting';
                    let path = 'src/emailTemplates/candidateAdditionText.html';
                    var replacements =  {
                        first:candidateFirstName,
                        last:candidateLastName,
                        position:status   
                    };
                    const  getEllowAdmins = {
                        name: 'get-ellow-admin',
                        text: jobReceivedQuery.getellowAdmins,
                        values: []
                
    
                }
                var ellowAdmins=await client.query(getEllowAdmins)
                if(Array.isArray(ellowAdmins.rows))
                {
                    
                    ellowAdmins.rows.forEach(element => {
                       
                            emailClient.emailManagerForNoReply(element.email,subject,path,replacements); 
                        
                           
                        })
                            
                }
            
                }
                
                resolve({ code: 200, message: "Candidate profile submitted", data: {} });
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


// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update the skills of a candidate
export const editSkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                var candidateId=_body.candidateId
                _body.skillSet = ![undefined, null].includes(_body.skills) ? _body.skills.map(a => a.skill.skillId) :[];
                await client.query(queryService.deleteCandidateSkillsQuery(_body))
                if (Array.isArray(_body.skills))
                {
                    let promise=[];
                    _body.skills.forEach(element => { 
                        let competency=element.competency=== '' ? null :element.competency
                        let preffered=element.preferred
                        let skillId=element.skill["skillId"]
                        let yearsOfExperience=element.yoe=== '' ? null :element.yoe
                        let skillVersion = element.skillVersion=== ''? null :element.skillVersion
                        const addSkills = {
                            name: 'add-candidate-skills',
                            text: jobReceivedQuery.addCandidateSkills,
                            values: [candidateId, skillId,competency,preffered,yearsOfExperience,skillVersion,currentTime,_body.employeeId,true],
                        }
                        promise.push(client.query(addSkills))
                    });
                    await Promise.all(promise);
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
    
    
}






