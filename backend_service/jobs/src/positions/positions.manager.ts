import positionsQuery from './query/positions.query';
import database from '../common/database/database';
import { createNotification } from '../common/notifications/notifications';
import config from '../config/config'
import * as emailClient from '../emailService/emailService';
import * as queryService from '../queryService/queryService';
import * as utils from '../utils/utils';

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get the position detils of a company
export const getCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                   _body.queryText='';
                    _body.queryValues={};
                    var filterQuery='', filter=_body.body.filter,
                    body=_body.query,reqBody=_body.body, sort = '', searchKey = '%%';
                            
                    // Search for filters in the body        
                    let filterResult = utils.positionFilter(filter,filterQuery,_body.queryValues);
                    filterQuery = filterResult.filterQuery;
                    _body.queryValues = filterResult.queryValues;

                    if(![undefined,null].includes(body.searchKey))
                    {
                        searchKey='%' + body.searchKey + '%';
                    }        
                    
                    if (reqBody.userRoleId == 1) {
                        _body.queryText = positionsQuery.getCompanyPositionsForAdmin+filterQuery+utils.positionSort(body);
                        _body.queryValues =  Object.assign({searchkey:searchKey,employeeid:reqBody.employeeId},_body.queryValues)
                        // Object.assign({searchkey:searchKey,employeeid:reqBody.employeeId},queryValues)
                    }
                    else { 
                        _body.queryText = positionsQuery.getCompanyPositionsForBuyer +filterQuery+ utils.positionSort(body);
                        _body.queryValues =  Object.assign({companyid:reqBody.companyId,searchkey:searchKey,employeeid:reqBody.employeeId},_body.queryValues)
                    }
                    let results=await client.query(queryService.fetchCompanyPositionsById(_body))
                    var steps = results.rows
                    resolve({ code: 200, message: "Positions listed successfully", data: { positions: steps } })
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK')
        console.log("e : ",e)
        reject({ code: 400, message: "Failed. Please try again.", data: {} });
    }
})().catch(e => {
    console.log(e)
    reject({ code: 400, message: "Failed. Please try again.", data: {} })
})
})


}

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Create a new position for a company
export const createCompanyPositions = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let hiringStepQueries = [];
                _body.cmpId = _body.userRoleId==1?_body.positionCreatedCompanyId:_body.companyId;
                let companyId= _body.cmpId
                const getCompanyNameResponse =  await client.query(queryService.getCompanyNameQuery(_body))
                const companyName = getCompanyNameResponse.rows[0].companyName
                const companyPositionResponse = await client.query(queryService.addCompanyPositionsQuery(_body))
                const positionId = companyPositionResponse.rows[0].position_id
                _body.positionId=positionId
                _body.tSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["topRatedSkill"]))?_body.skills["topRatedSkill"].map(a => a.skillId):[];
                _body.oSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["otherSkill"]))?_body.skills["otherSkill"].map(a => a.skillId):[];
                
                if(_body.tSkill.length>0)
                {
                    await client.query(queryService.addTopSkillsQuery(_body))
                }
                if(_body.oSkill.length>0)
                {
                    await client.query(queryService.addOtherSkillsQuery(_body))
                }
                await client.query('COMMIT')
                
                if(![null,undefined,''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps))
                {
                    let order = 1;
                    _body.hiringSteps.forEach(element => {
                        const insertHiringStepsQuery = {
                            name: 'add-hiring-steps',
                            text: positionsQuery.insertHiringSteps,
                            values: [positionId, element.hiringStepName,element.hiringStepType,order,_body.employeeId,Date.now(),element.hiringAssesmentName,element.hiringAssesmentType,element.default],
                        }
                        hiringStepQueries.push(client.query(insertHiringStepsQuery));
                        order++;
                    });   
                }
                await Promise.all(hiringStepQueries);
                if (_body.flag == 0) {
                    resolve({ code: 200, message: "Positions created successfully", data: { positionId, companyName } });
                    return;
                }                
                resolve({ code: 200, message: "Positions created successfully", data: { positionId,companyId  } });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } 
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}


// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Fetch the details of a position created by a company
export const fetchPositionDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {

                    let results= await client.query(queryService.fetchPositionDetails(_body))
                    const queryResult = results.rows;
                    let skills = [];
                    let result = {};
                    let topRatedSkill=[],otherSkill=[];
                    queryResult.forEach(step => {
                        result = {
                            maxBudget: step.max_budget,
                            minBudget: step.min_budget,
                            billingType: step.billing_type,
                            contractStartDate: step.contract_start_date,
                            contractDuration:step.contract_duration,
                            immediate:step.immediate,
                            currencyTypeId: step.currency_type_id,
                            developerCount: step.developer_count,
                            allowRemote: step.allow_remote,
                            experienceLevel: step.experience_level,
                            document: step.job_document,
                            positionName: step.position_name,
                            locationName: step.location_name,
                            createdOn: step.created_on,
                            jobDescription: step.job_description,
                            jobCategoryId: step.job_category_id,
                            jobStatus: step.job_status,
                            jobCategoryName: step.job_category_name,
                            companyId: step.company_id,
                            companyName: step.company_name,
                            companySize : step.company_size,
                            companyLogo : step.company_logo,
                            createdBy : step.createdBy,
                            fullName : step.fullName,
                            email : step.email,
                            phoneNumber : step.phoneNumber,
                            companyLinkedinId: step.company_linkedin_id,
                            skills: []
                        }
                        
                        if (step.skill_id != null && skills.findIndex(({ skillId }) => skillId === step.skill_id) === -1)
                        {
                            step.top_rated_skill?
                            topRatedSkill.push(
                                {
                                    skillId: step.skill_id,
                                    skillName: step.skill_name
                                }
                                ):
                                otherSkill.push(
                                    {
                                        skillId: step.skill_id,
                                        skillName: step.skill_name
                                    }
                                    );
                                }
                                
                                result['positionId'] = _body.positionId;
                            })
                            result['skills'] = {topRatedSkill,otherSkill};
                            resolve({ code: 200, message: "Fetched position details successfully", data: result });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } 
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}
        
        // >>>>>>> FUNC. >>>>>>> 
        //>>>>>>>>>>>>>>>>>>Update company position details
        export const updateCompanyPositions = async (_body) => {
            return new Promise((resolve, reject) => {
                const currentTime = Math.floor(Date.now() / 1000);
                const positionId = _body.positionId;
                const companyId = _body.userRoleId==1?_body.positionCreatedCompanyId:_body.companyId;
                (async () => {
                    const client = await database().connect()
                    try {
                        _body.cmpId=companyId
                        await client.query('BEGIN');
                        let hiringStepQueries=[];
                            const getCompanyNameResponse =  await client.query(queryService.getCompanyNameQuery(_body))
                            const companyName = getCompanyNameResponse.rows[0].companyName
                            await client.query(queryService.updateCompanyPositionsFirstQuery(_body))
                            await client.query(queryService.updateCompanyPositionsSecondQuery(_body))
                            await client.query('COMMIT')
                            _body.tSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["topRatedSkill"]))?_body.skills["topRatedSkill"].map(a => a.skillId):[];
                            _body.oSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["otherSkill"]))?_body.skills["otherSkill"].map(a => a.skillId):[];  
                            _body.skillSet = _body.tSkill.concat( _body.oSkill);
                            await client.query(queryService.deleteJobSkillsQuery(_body))
                            await client.query('COMMIT')
                            if(_body.tSkill.length>0)
                                {
                                    await client.query(queryService.addTopSkillsQuery(_body))
                                }
                                if(_body.oSkill.length>0)
                                {
                                    await client.query(queryService.addOtherSkillsQuery(_body))
                                }
                                if(![null,undefined,''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps))
                                {
                                    let order=1;
                                    _body.hiringSteps.forEach(element => {
                                        const insertHiringStepsQuery = {
                                            name: 'add-hiring-steps',
                                            text: positionsQuery.insertHiringSteps,
                                            values: [positionId, element.hiringStepName,element.hiringStepType,order,_body.employeeId,Date.now(),element.hiringAssesmentName,element.hiringAssesmentType,element.default],
                                        }
                                        hiringStepQueries.push(client.query(insertHiringStepsQuery));
                                        order++;
                                    });   
                                }
                                await Promise.all(hiringStepQueries);
                                resolve({ code: 200, message: "Position updated successfully", data: { positionId, companyName } });

                            } catch (e) {
                                await client.query('ROLLBACK')
                                console.log(e)
                                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                            } finally {
                                client.release();
                            }
                        })().catch(e => {
                            console.log(e)

                            reject({ code: 400, message: "Failed. Please try again.", data: e.message  })
                        })
                    })
                }
                
                // >>>>>>> FUNC. >>>>>>> 
                //>>>>>>>>>>>>>>>>>>Publish the position details so that it will be visible to all other users (providers)
                export const publishCompanyPositions = async (_body) => {
                    return new Promise((resolve, reject) => {
                        const currentTime = Math.floor(Date.now() / 1000);
                        (async () => {
                            const client = await database().connect()
                            try {
                                await client.query('BEGIN');
                                const positionId = _body.positionId;
                                await client.query(queryService.changePositionStatusQuery(_body))
                                const data = await client.query(queryService.addPositionToJobReceivedQuery(_body))
                                const jobReceivedId = data.rows[0].job_received_id
                                const details = await client.query(queryService.getNotificationDetailsQuery(_body))
                                await client.query('COMMIT');
                                const { companyId, companyName,positionName } = details.rows[0];
                                const message = `A new position,${positionName} has been created by ${companyName}`
                                var cName=companyName
                                var cpName=positionName
                                console.log({ positionId, jobReceivedId, companyId, message, candidateId: null, notificationType: 'position',userRoleId:1 })
                                await createNotification({ positionId, jobReceivedId, companyId, message, candidateId: null, notificationType: 'position',userRoleId:_body.userRoleId,employeeId:_body.employeeId})
                                var subject='New position notification'
                                // Sending a notification mail about position creation; to the admin
                                let path = 'src/emailTemplates/positionCreationText.html';
                                var userReplacements = {
                                    company:cName,
                                    position:cpName  
                                };
                                var ellowAdmins=await client.query(queryService.getEllowAdmins(_body))
                                if(Array.isArray(ellowAdmins.rows))
                                {
                                    ellowAdmins.rows.forEach(element => {
                                        emailClient.emailManager(element.email,subject,path,userReplacements);

                                        })
                                        resolve({ code: 200, message: "Position published successfully", data: {} });

                                }
                            } catch (e) {
                                console.log("Error1",e)
                                await client.query('ROLLBACK')
                                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                            } finally {
                                client.release();
                            }
                        })().catch(e => {
                            console.log("Error2",e.message)
                            reject({ code: 400, message: "Failed. Please try again.", data: {} })
                        })
                    })
                }
                
                
                // >>>>>>> FUNC. >>>>>>> 
                //>>>>>>>>>>>>>>>>>> Change job status for a position
                export const changeJobStatus = (_body) => {
                    return new Promise((resolve, reject) => {
                        const currentTime = Math.floor(Date.now() / 1000);
                        
                        (async () => {
                            const client = await database().connect()
                            
                            try {
                                await client.query('BEGIN');
                                var jobReceivedId;
                                var message;
                                let positionName;
                                await client.query(queryService.positionQuery(_body))
                                await client.query(queryService.changeJobReceivedStatusQuery(_body))
                                      
                                            // If job status is 6, it means admin is reopening a position
                                if (_body.jobStatus==6)
                                {
                                    var results=await client.query(queryService.getMailAddress(_body))

                                    jobReceivedId=results.rows[0].job_received_id    
                                    positionName=results.rows[0].position_name
                                    var emailAddress=results.rows[0].email
                                    message=`A position,${positionName} has been reopened.`
                                    createNotification({ positionId:_body.positionId, jobReceivedId:jobReceivedId, companyId:_body.companyId, message:message, candidateId: null, notificationType: 'position',userRoleId:_body.userRoleId,employeeId:_body.employeeId })
                                    // A notification is sent to the hirer about his/her reopened position
                                    let subj="Position Reopen Notification"
                                    let path = 'src/emailTemplates/positionReopenText.html';
                                    var userReplacements = {
                                            position:positionName
                                        };
                                    emailClient.emailManager(emailAddress,subj,path,userReplacements);
                                       
                                }
                                            
                                            // If job status is 8,then the position is closed.
                                else if(_body.jobStatus==8)
                                            {
                                               
                                                var results=await client.query(queryService.mailAddress(_body))  
                                                    jobReceivedId=results.rows[0].job_received_id    
                                                    positionName=results.rows[0].position_name
                                                    var emailId=results.rows[0].email
                                                    message=`A position,${positionName} has been closed.`
                                                    createNotification({ positionId:_body.positionId, jobReceivedId:jobReceivedId, companyId:_body.companyId, message:message, candidateId: null, notificationType: 'position',userRoleId:_body.userRoleId,employeeId:_body.employeeId })
                                                    if(_body.userRoleId==1)
                                                    {
                                                        let subj="Close Position Notification"
                                                        let path = 'src/emailTemplates/positionCloseText.html';
                                                        var userReplacements ={
                                                            position:positionName
                                                        };
                                                        emailClient.emailManager(emailId,subj,path,userReplacements);
                                                    }
                                                    else
                                                    {
                                                        let subj="Close Position Notification"
                                                        let path = 'src/emailTemplates/positionCloseText.html';
                                                        var userReplacements = {
                                                            position:positionName
                                                        };
                                                        var ellowAdmins=await client.query(queryService.getEllowAdmins(_body))
                                                        if(Array.isArray(ellowAdmins.rows))
                                                        {
                                                            ellowAdmins.rows.forEach(element => {
                                                                emailClient.emailManager(element.email,subj,path,userReplacements);

                                                                })
                                                                
                                                        }
                                                    }
                                            }   
                                            
                               
                                resolve({ code: 200, message: "Job status changed", data: {} });
                                
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
                //>>>>>>>>>>>>>>>>>>Get the list of the companies with details
                export const getCompanies = (_body) => {
                    return new Promise((resolve, reject) => {
                        const CompanyQuery = {
                            name: 'get-company-names',
                            text: positionsQuery.getNames,
                            values: {'accounttype': _body.accountType},
                        }
                        database().query(CompanyQuery, (error, results) => {
                            if (error) {
                                reject({ code: 400, message: "Error in database connection.", data: {} });
                                return;
                            }
                            else
                            resolve({ code: 200, message: "Companies listed successfully", data: { companies: results.rows } });     
                        })
                    }).catch((err)=>{
                        throw ({ code: 400, message: "Error in database connection.", data: {} });
                    })
                }
                
                
                // >>>>>>> FUNC. >>>>>>> 
                //>>>>>>>>>>>>>>>>>>Delete a position from a users position page
                export const deletePositions = (_body) => {
                    return new Promise((resolve, reject) => {
                        (async () => {
                            const client = await database().connect()
                            try {
                                await client.query('BEGIN');
                                const positionId = _body.positionId;
                                
                                const currentTime = Math.floor(Date.now() / 1000);
                                const updateStatus=false;
                                const updatePositionStatus = {
                                    name: 'change-positionstatus',
                                    text:positionsQuery.updatePositionStatus,
                                    values:[positionId,currentTime,updateStatus]
                                }
                                await client.query(updatePositionStatus);
                                
                                const updateJobReceivedStatus = {
                                    name: 'change-JobReceivedStatus',
                                    text:positionsQuery.updateJobReceivedStatus,
                                    values:[positionId,currentTime,updateStatus]
                                }
                                let result = await client.query(updateJobReceivedStatus);
                                
                                let jobReceivedId = result.rows[0]!=undefined?result.rows[0].job_received_id:null;                                    
                                if(![null,undefined].includes(jobReceivedId))
                                {
                                    const updateCompanyJobStatus = {
                                        name: 'change-CompanyJobStatus',
                                        text:positionsQuery.updateCompanyJobStatus,
                                        values:[jobReceivedId,currentTime,updateStatus]
                                    }
                                    await client.query(updateCompanyJobStatus);
                                }
                                
                                const getMailAddress = {
                                    name: 'fetch-emailaddress',
                                    text:positionsQuery.getEmailAddressOfBuyerFromPositionId,
                                    values:[positionId]
                                }
                                var employeeData = await client.query(getMailAddress);                
                                var positionName=employeeData.rows[0].position_name
                                var emailAddress=employeeData.rows[0].email
                                await client.query('COMMIT');
                                
                                let path = 'src/emailTemplates/positionDeletionText.html';
                                let adminPath = 'src/emailTemplates/positionDeletionAdminText.html';
                                var userReplacements = {
                                    position:positionName
                                };
                                emailClient.emailManager(emailAddress,config.PositionText.subject,path,userReplacements);
                                var ellowAdmins=await client.query(queryService.getEllowAdmins(_body))
                                if(Array.isArray(ellowAdmins.rows))
                                {
                                    ellowAdmins.rows.forEach(element => {
                                        emailClient.emailManager(element.email,config.PositionText.subject,adminPath,userReplacements);

                                        })
                                        const message=`The position, ${positionName}  has been removed .`
                                        await createNotification({ positionId, jobReceivedId, companyId:_body.companyId, message, candidateId: null, notificationType: 'positionList',userRoleId:_body.userRoleId,employeeId:_body.employeeId })
                                        resolve({ code: 200, message: "Position deletion successfull", data: {} });
                                }
                         
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
                //>>>>>>>>>>>>>>>>>>Change read status of a position
                export const changeReadStatus = (_body) => {
                    const currentTime = Math.floor(Date.now() / 1000);
                    
                    return new Promise((resolve, reject) => {
                        const CompanyQuery = {
                            name: 'update-read-status',
                            text: positionsQuery.insertReadStatus,
                            values: [_body.positionId,_body.employeeId,currentTime],
                        }
                        database().query(CompanyQuery, (error, results) => {
                            if (error) {
                                console.log(error)
                                reject({ code: 400, message: "Error in database connection.", data: {} });
                                return;
                            }
                            resolve({ code: 200, message: "Read status updated", data: {} });
                        })
                    })
                }
                
                // >>>>>>> FUNC. >>>>>>> 
                //>>>>>>>>>>>>>>>>>>Change read status of a position
                export const updateAllocatedTo = (_body) => {
                    const currentTime = Math.floor(Date.now() / 1000);
                    
                    return new Promise((resolve, reject) => {
                        const CompanyQuery = {
                            name: 'update-allocated-to',
                            text: positionsQuery.updateAllocatedTo,
                            values: [_body.allocatedTo,_body.positionId,currentTime,_body.employeeId],
                        }
                        database().query(CompanyQuery, (error, results) => {
                            if (error) {
                                console.log(error)
                                reject({ code: 400, message: "Error in database connection.", data: {} });
                                return;
                            }
                            resolve({ code: 200, message: "Updated allocated to of position", data: {} });
                        })
                    })
                }