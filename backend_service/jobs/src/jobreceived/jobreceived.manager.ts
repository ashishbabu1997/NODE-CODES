import jobReceivedQuery from './query/jobreceived.query';
import database from '../common/database/database';
import * as format from 'pg-format';
import { createNotification } from '../common/notifications/notifications';
import * as handlebars from 'handlebars'
import config from '../config/config'
import {readHTMLFile} from '../middlewares/htmlReader'
import * as emailClient from '../emailService/emailService';
import * as passwordGenerator from 'generate-password'
import * as crypto from 'crypto';
import { ImportsNotUsedAsValues } from 'typescript';

 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all job received details of a company
export const getAllJobReceived = (_body) => {
    
    return new Promise((resolve, reject) => {
        
        var selectQuery = jobReceivedQuery.getAllJobReceived;
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
        queryText = selectQuery + filterQuery + searchQuery + sort;
        queryValues =  Object.assign({companyid:body.companyId,employeeid:body.employeeId},queryValues)
        
        const query = {
            name: 'get-all-positions-provider',
            text: queryText,
            values: queryValues
        }
        database().query(query, (error, results) => {
            if (error) {              
                console.log("error : ",error);
                reject({ code: 400, message: "Database error", data : error });
                return;
            }
            let Jobs = results.rows;

            if(Array.isArray(Jobs))
            Jobs = results.rows.filter(element => element.jobStatus != 8 || element.totalCount != 0)
            resolve({ code: 200, message: "Job Received listed successfully", data: { Jobs} });
            
        })
    }).catch((err)=>{
        console.log("error raised : ",err);
        return ({ code: 400, message: "Database error", data: err });
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all job received details using job received id
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


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update job received status of a user company
export const updateIsRejectForJobReceived = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
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


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Fetch profile details of a company by using company id
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

 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Save the candidate profile details
export const saveCandidateProfile = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const checkEMailExistence = {
                    name: 'check-mail',
                    text: jobReceivedQuery.checkEMail,
                    values: [_body.email],
                }
                var results= await client.query(checkEMailExistence);
                await client.query('COMMIT');
                if (results.rowCount==1)
                {
                    reject({ code: 400, message: "Candidate already registered", data: {} });

                }
                else
                {
                            let sellerCompanyId = _body.userRoleId==1?_body.sellerCompanyId:_body.companyId;
                            let candidates = [_body.firstName, _body.lastName, sellerCompanyId, _body.jobReceivedId, _body.description, _body.email, _body.phoneNumber, currentTime, currentTime, _body.employeeId, _body.employeeId, 4, _body.image, _body.citizenship, _body.residence,_body.candidatePositionName]    
                            const saveCandidateQuery = {
                                name: 'add-Profile',
                                text: format(jobReceivedQuery.addProfile, [candidates]),
                            }
                            var addCandidateResult = await client.query(saveCandidateQuery);
                            const getCompanyName = {
                                name: 'add-company-name',
                                text: jobReceivedQuery.fetchCompanyName,
                                values: [sellerCompanyId],
                            }
                            var companyResults = await client.query(getCompanyName);
                            var companyName=companyResults.rows[0].company_name
                            if (_body.userRoleId==1 &&companyName=='Freelancer')
                            {
                                    const addEmployee = {
                                        name: 'add-employee',
                                        text: jobReceivedQuery.addEmployee,
                                        values: [_body.firstName, _body.lastName,sellerCompanyId, _body.email, _body.phoneNumber, currentTime]   
                                    }
                                    var employeeResult= await client.query(addEmployee);
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
                            await client.query('COMMIT');
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
                const updateCandidateStatus = {
                    name: 'update-candidate-status',
                    text: jobReceivedQuery.updateCandidateStatus,
                    values: [candidateId, _body.employeeId, currentTime],
                }
                let result = await client.query(updateCandidateStatus);
        
                const addDefaultTraits = {
                    name: 'add-default-traits',
                    text: jobReceivedQuery.addDefaultAssessmentTraits,
                    values: {candidateid:_body.candidateId, employeeid:_body.employeeId, currenttime:currentTime},
                }
                await client.query(addDefaultTraits);
                
                let candidateFirstName=result.rows[0].candidate_first_name;
                let candidateLastName=result.rows[0].candidate_last_name;
                let emailAddress=result.rows[0].email_address;
                let companyId = result.rows[0].company_id;
                let jobReceivedId = result.rows[0].job_received_id;
                let positionName = _body.positionName;
                const getCompanyName = {
                    name: 'add-company-name',
                    text: jobReceivedQuery.fetchCompanyName,
                    values: [companyId],
                }
                var companyResults = await client.query(getCompanyName);
                var companyName=companyResults.rows[0].company_name
                if (_body.userRoleId==1 && companyName=='Freelancer')
                {
                        const password = passwordGenerator.generate({
                            length: 10,
                            numbers: true
                        });
                        var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                        const updatePasswordToEmployee = {
                            name: 'update-password',
                            text: jobReceivedQuery.updatePassword,
                            values: [hashedPassword,true,1,emailAddress],
                        }
                        await client.query(updatePasswordToEmployee);
                        var userSubject="ellow.io Freelancer Login Credentials"
                        let userPath = 'src/emailTemplates/candidateAdditionText.html';
                        var userCredentialReplacements =  {
                            name:candidateFirstName,
                            user:emailAddress,
                            password:password    
                        };
                        emailClient.emailManager(emailAddress,userSubject,userPath,userCredentialReplacements);
                    
                }
                else
                {
                    console.log("Submitted profile is not a freelancer")
                }
                await client.query('COMMIT');
                var subject='New Candidate Notification'
                if(![null,undefined,""].includes(_body.positionId))
                {

                    const message = `A new candidate named ${candidateFirstName + ' ' + candidateLastName} has been submitted for the position ${positionName} `
                    await createNotification({ positionId:_body.positionId, jobReceivedId, companyId, message, candidateId, notificationType: 'position',userRoleId:_body.userRoleId,employeeId:_body.employeeId })   
                    let path = 'src/emailTemplates/candidateAdditionText.html';
                    var userReplacements =  {
                        first:candidateFirstName,
                        last:candidateLastName,
                        position:positionName,     
                    };
                    emailClient.emailManager(config.adminEmail,subject,path,userReplacements);
                }
                else
                {
                    const message = `A new candidate named ${candidateFirstName + ' ' + candidateLastName} has been submitted for veting `
                    await createNotification({ positionId:_body.positionId, jobReceivedId, companyId, message, candidateId, notificationType: 'position',userRoleId:_body.userRoleId,employeeId:_body.employeeId })   
                    var status='vetting';
                    let path = 'src/emailTemplates/candidateAdditionText.html';
                    var replacements =  {
                        first:candidateFirstName,
                        last:candidateLastName,
                        position:status   
                    };
                    emailClient.emailManager(config.adminEmail,subject,path,replacements); 
                }
                
                resolve({ code: 200, message: "Candidate profile submitted", data: {} });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
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
                let skillSet = ![undefined, null].includes(_body.skills) ? _body.skills.map(a => a.skill.skillId) :[];
                const deleteCandidateSkillsQuery = {
                    name: 'delete-candidate-skills',
                    text: jobReceivedQuery.deleteCandidateSkills,
                    values: [candidateId, skillSet],
                }
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