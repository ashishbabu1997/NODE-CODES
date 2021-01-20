import positionsQuery from './query/positions.query';
import database from '../common/database/database';
import { createNotification } from '../common/notifications/notifications';
import config from '../config/config'
import * as emailClient from '../emailService/emailService';
import * as queryService from '../queryService/queryService';


// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get the position detils of a company
export const getCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        var queryText='', queryValues={}, filterQuery='', filter=_body.body.filter,
        body=_body.query, sort = '', searchKey = '%%';
        
        const orderBy = {
            "position": 'p.position_id',
            "positionName": 'p.position_name',
            "createdOn": 'p.created_on',
            "candidateCount": '"candidateCount"',
            "resourceCount": 'p.developer_count',
            "companyName": 'c.company_name',
            "updatedOn":'p.updated_on'
        }
        
        if(filter)
        {            
            if(filter.postedStartDate && filter.postedEndDate)
            {   
                filterQuery=filterQuery+' AND p.created_on BETWEEN $startdate  AND $enddate'
                queryValues = Object.assign({startdate:filter.postedStartDate,enddate:filter.postedEndDate})
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
        if(body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy))  
        {
            sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;
        }
        if(![undefined,null].includes(body.searchKey))
        {
            searchKey='%' + body.searchKey + '%';
        }
        
        if (body.userRoleId == 1) {
            queryText = positionsQuery.getCompanyPositionsForAdmin+filterQuery+sort;
            queryValues = Object.assign({searchkey:searchKey,employeeid:body.employeeId},queryValues)
        }
        else {            
            queryText = positionsQuery.getCompanyPositionsForBuyer +filterQuery+ sort;
            queryValues =  Object.assign({companyid:body.companyId,searchkey:searchKey,employeeid:body.employeeId},queryValues)
        }
        
        const query = {
            name: 'id-fetch-company-positions',
            text: queryText,
            values: queryValues
        }
        database().query(query, (error, results) => {
            if (error) {
                console.error("err : ",error); 
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
                return;
            }
            var steps = results.rows
            resolve({ code: 200, message: "Positions listed successfully", data: { positions: steps } })
        })  
    }).catch(err=>{
        console.error("err : ",err); 
        throw ({ code: 400, message: "Database error Please try again.", data: err.message });
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
                const companyId = _body.userRoleId==1?_body.positionCreatedCompanyId:_body.companyId;
                
                const addCompanyPositionsQuery = {
                    name: 'add-company-positions',
                    text: positionsQuery.addCompanyPositions,
                    values: {
                        name:_body.positionName, devcount:_body.developerCount, companyid:companyId,
                        explevel:_body.experienceLevel, jobdesc:_body.jobDescription, doc:_body.document, 
                        currencyid:_body.currencyTypeId, billingtype:_body.billingType, 
                        empid:_body.employeeId,  time:currentTime, jobcatid:_body.jobCategoryId
                    }
                }
                const getCompanyNameQuery = {
                    name: 'get-company-name',
                    text: positionsQuery.getCompanyName,
                    values: [companyId]
                }
                const getCompanyNameResponse = await client.query(getCompanyNameQuery);
                const companyName = getCompanyNameResponse.rows[0].companyName
                const companyPositionResponse = await client.query(addCompanyPositionsQuery);
                const positionId = companyPositionResponse.rows[0].position_id
                
                let tSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["topRatedSkill"]))?_body.skills["topRatedSkill"].map(a => a.skillId):[];
                let oSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["otherSkill"]))?_body.skills["otherSkill"].map(a => a.skillId):[];
                
                if(tSkill.length>0)
                {
                    const addTopSkillsQuery = {
                        name: 'add-top-job-skills',
                        text: positionsQuery.addJobSkills,
                        values: [positionId, tSkill,true, currentTime],
                    }
                    await client.query(addTopSkillsQuery);
                }
                if(oSkill.length>0)
                {
                    const addOtherSkillsQuery = {
                        name: 'add-other-job-skills',
                        text: positionsQuery.addJobSkills,
                        values: [positionId, oSkill,false, currentTime],
                    }
                    await client.query(addOtherSkillsQuery);
                }
                await client.query('COMMIT')

                if(![null,undefined,''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps))
                {
                    let order = 1;
                    _body.hiringSteps.forEach(element => {
                        const insertHiringStepsQuery = {
                            name: 'add-hiring-steps',
                            text: positionsQuery.insertHiringSteps,
                            values: [positionId, element.hiringStepName,element.hiringStepType,order,_body.employeeId,Date.now(),element.hiringAssesmentName,element.hiringAssesmentType],
                        }
                        hiringStepQueries.push(client.query(insertHiringStepsQuery));
                        order++;
                    });   
                }
                await Promise.all(hiringStepQueries);
                
                if (_body.flag == 0) {
                    await client.query('COMMIT'); 
                    resolve({ code: 200, message: "Positions created successfully", data: { positionId, companyName } });
                    return;
                }

                await client.query('COMMIT')

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
        const query = {
            name: 'fetch-position-details',
            text: positionsQuery.getPositionDetailsQuery,
            values: [parseInt(_body.positionId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
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
                })
            });
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
                        await client.query('BEGIN');
                        let hiringStepQueries=[];
                        const updateCompanyPositionsFirstQuery = {
                            name: 'update-company-positions-first',
                            text: positionsQuery.updatePositionFirst,
                            values: [_body.positionName, _body.locationName, _body.developerCount,
                                _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document,
                                _body.employeeId, currentTime, positionId, companyId, _body.jobCategoryId]
                            }
                            const getCompanyNameQuery = {
                                name: 'get-company-name',
                                text: positionsQuery.getCompanyName,
                                values: [companyId]
                            }
                            const getCompanyNameResponse = await client.query(getCompanyNameQuery);
                            const companyName = getCompanyNameResponse.rows[0].companyName
                            await client.query(updateCompanyPositionsFirstQuery);
                            
                            const updateCompanyPositionsSecondQuery = {
                                name: 'update-company-positions-second',
                                text: positionsQuery.updatePositionSecond,
                                values: [_body.contractStartDate,
                                    _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget,
                                    _body.employeeId, currentTime, positionId, companyId,_body.contractDuration,_body.immediate]
                                }
                                
                                await client.query(updateCompanyPositionsSecondQuery);
                                let tSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["topRatedSkill"]))?_body.skills["topRatedSkill"].map(a => a.skillId):[];
                                let oSkill = (![undefined,null].includes(_body.skills) && Array.isArray(_body.skills["otherSkill"]))?_body.skills["otherSkill"].map(a => a.skillId):[];
                                
                                let skillSet = tSkill.concat(oSkill);
                                
                                const deleteJobSkillsQuery = {
                                    name: 'delete-job-skills',
                                    text: positionsQuery.deletePositionSkills,
                                    values: [positionId, skillSet],
                                }                
                                await client.query(deleteJobSkillsQuery)
                                
                                if(tSkill.length>0)
                                {
                                    const addTopSkillsQuery = {
                                        name: 'add-top-job-skills',
                                        text: positionsQuery.addJobSkills,
                                        values: [positionId, tSkill,true, currentTime],
                                    }
                                    console.log("addTopSkill : ",addTopSkillsQuery);
                                    
                                    await client.query(addTopSkillsQuery);
                                    
                                }
                                if(oSkill.length>0)
                                {
                                    const addOtherSkillsQuery = {
                                        name: 'add-other-job-skills',
                                        text: positionsQuery.addJobSkills,
                                        values: [positionId, oSkill,false, currentTime],
                                    }
                                    console.log("addOtherSkill : ",addOtherSkillsQuery);
                                    
                                    await client.query(addOtherSkillsQuery);
                                }
                                
                                if(![null,undefined,''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps))
                                {
                                    let order=1;
                                    _body.hiringSteps.forEach(element => {
                                        const insertHiringStepsQuery = {
                                            name: 'add-hiring-steps',
                                            text: positionsQuery.insertHiringSteps,
                                            values: [positionId, element.hiringStepName,element.hiringStepType,order,_body.employeeId,Date.now(),element.hiringAssesmentName,element.hiringAssesmentType],
                                        }
                                        hiringStepQueries.push(client.query(insertHiringStepsQuery));
                                        order++;
                                    });   
                                }
                                await Promise.all(hiringStepQueries);
                                if (_body.flag == 0) {
                                    await client.query('COMMIT');
                                    resolve({ code: 200, message: "Position updated successfully", data: { positionId, companyName } });
                                    return;
                                }
                                
                                await client.query('COMMIT')
                                resolve({ code: 200, message: "Position updated successfully", data: { positionId, companyName } });
                            } catch (e) {
                                await client.query('ROLLBACK')
                                console.log(e)
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
                //>>>>>>>>>>>>>>>>>>Publish the position details so that it will be visible to all other users (providers)
                export const publishCompanyPositions = async (_body) => {
                    return new Promise((resolve, reject) => {
                        const currentTime = Math.floor(Date.now() / 1000);
                        (async () => {
                            const client = await database().connect()
                            try {
                                await client.query('BEGIN');
                                const positionId = _body.positionId;
                                const changePositionStatusQuery = {
                                    name: 'change-position-status',
                                    text: positionsQuery.changePositionStatus,
                                    values: [positionId, currentTime]
                                }
                                await client.query(changePositionStatusQuery);
                                const addPositionToJobReceivedQuery = {
                                    name: 'add-position-to-job-received',
                                    text: positionsQuery.addPositionToJob,
                                    values: [positionId, currentTime],
                                }
                                const data = await client.query(addPositionToJobReceivedQuery);
                                const jobReceivedId = data.rows[0].job_received_id
                                const getNotificationDetailsQuery = {
                                    name: 'get-notification-details',
                                    text: positionsQuery.getNotificationDetails,
                                    values: [positionId]
                                }
                                const details = await client.query(getNotificationDetailsQuery);
                                await client.query('COMMIT');
                                const { companyId, companyName,positionName } = details.rows[0];
                                const message = `A new position named ${positionName} has been created by ${companyName}`
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
                                emailClient.emailManager(config.adminEmail,subject,path,userReplacements);
                                resolve({ code: 200, message: "Position published successfully", data: {} });
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
                                const positionQuery = {
                                    name: 'change-job-status',
                                    text: positionsQuery.changeJobStatus,
                                    values: [currentTime, _body.positionId,_body.jobStatus],
                                }
                                database().query(positionQuery, (error, results) => {
                                    if (error) {
                                        console.log(error)
                                        reject({ code: 400, message: "Error in database connection.", data: {} });
                                        return;
                                    }
                                    const jobReceivedQuery = {
                                        name: 'change-job-received-status',
                                        text: positionsQuery.changeJobReceivedStatus,
                                        values: [currentTime, _body.positionId,_body.jobStatus],
                                    }
                                    database().query(jobReceivedQuery, (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            reject({ code: 400, message: "Error in database connection.", data: {} });
                                            return;
                                        }
                                        else {
                                            // If job status is 6, it means admin is reopening a position
                                            if (_body.jobStatus==6)
                                            {
                                                const getMailAddress = {
                                                    name: 'fetch-emailaddress',
                                                    text:positionsQuery.getEmailAddressOfBuyerFromPositionId,
                                                    values:[_body.positionId]
                                                }
                                                database().query(getMailAddress, (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        reject({ code: 400, message: "Error in database connection.", data: {} });
                                                        return;
                                                    }   
                                                    jobReceivedId=results.rows[0].job_received_id    
                                                    positionName=results.rows[0].position_name
                                                    var emailAddress=results.rows[0].email
                                                    message=`A position named ${positionName} has been reopened.`
                                                    createNotification({ positionId:_body.positionId, jobReceivedId:jobReceivedId, companyId:_body.companyId, message:message, candidateId: null, notificationType: 'position',userRoleId:_body.userRoleId,employeeId:_body.employeeId })
                                                    // A notification is sent to the hirer about his/her reopened position
                                                    let subj="Position Reopen Notification"
                                                    let path = 'src/emailTemplates/positionReopenText.html';
                                                    var userReplacements = {
                                                        position:positionName
                                                    };
                                                    emailClient.emailManager(emailAddress,subj,path,userReplacements);
                                                    
                                                })
                                                
                                            }
                                            
                                            // If job status is 8,then the position is closed.
                                            else if(_body.jobStatus==8)
                                            {
                                                const mailAddress = {
                                                    name: 'fetch-emailaddress',
                                                    text:positionsQuery.getEmailAddressOfBuyerFromPositionId,
                                                    values:[_body.positionId]
                                                }
                                                database().query(mailAddress, (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        reject({ code: 400, message: "Error in database connection.", data: {} });
                                                        return;
                                                    }   
                                                    jobReceivedId=results.rows[0].job_received_id    
                                                    positionName=results.rows[0].position_name
                                                    var emailId=results.rows[0].email
                                                    message=`A position named ${positionName} has been closed.`
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
                                                        emailClient.emailManager(config.adminEmail,subj,path,userReplacements);
                                                    }
                                                })
                                            }   
                                            
                                        }
                                        
                                    })
                                    
                                })
                                console.log(message)
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
                                var userReplacements = {
                                    position:positionName
                                };
                                emailClient.emailManager(emailAddress,config.PositionText.subject,path,userReplacements);
                                const message=`The position named ${positionName}  has been removed .`
                                await createNotification({ positionId, jobReceivedId, companyId:_body.companyId, message, candidateId: null, notificationType: 'positionList',userRoleId:_body.userRoleId,employeeId:_body.employeeId })
                                resolve({ code: 200, message: "Position deletion successfull", data: {} });
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