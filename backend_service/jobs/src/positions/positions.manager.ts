import positionsQuery from './query/positions.query';
import database from '../common/database/database';
import { createNotification } from '../common/notifications/notifications';
import { sendMail } from '../middlewares/mailer'
import config from '../config/config'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
export const getCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        var queryText;
        var queryValues;
        var filterQuery='';
        if(_body.body.filter)
        {
            if(_body.body.filter.postedOn)
            {
                filterQuery=filterQuery+' AND p.created_on BETWEEN '+_body.body.filter.postedOn.start+' AND '+_body.body.filter.postedOn.end
            }
            if(_body.body.filter.openPositions)
            {
                filterQuery=filterQuery+' AND p.job_status ='+_body.body.filter.openPositions
                
            }
            if(_body.body.filter.status)
            {
                filterQuery=filterQuery+' AND p.status='+_body.body.filter.status
                
            }
            if(_body.body.filter.duration)
            {
                filterQuery=filterQuery+' AND p.contract_duration= '+_body.body.filter.status
            }
            if(_body.body.filter.durationLimit)
            {
                filterQuery=filterQuery+' AND p.contract_duration BETWEEN '+_body.body.filter.durationLimit.start+' AND '+_body.body.filter.durationLimit.end
            }
            
        }


        
        const orderBy = {
            "position": 'p.position_id',
            "positionName": 'p.position_name',
            "createdOn": 'p.created_on',
            "candidateCount": '"candidateCount"',
            "resourceCount": 'p.developer_count',
            "companyName": 'c.company_name',
            "updatedOn":'p.updated_on'
        }
        if(_body.query.sortBy && _body.query.sortType && Object.keys(orderBy).includes(_body.query.sortBy))  
        {
            var sort = ' ORDER BY ' + orderBy[_body.query.sortBy] + ' ' + _body.query.sortType + ' LIMIT ' + _body.query.limit + ' OFFSET ' + _body.query.offset;
        }
        queryText = positionsQuery.getCompanyPositionsForAdmin +filterQuery+sort;
        console.log(queryText)
        if (_body.userRoleId == 1) {
            queryText = positionsQuery.getCompanyPositionsForAdmin +filterQuery+sort;
            console.log(queryText)
            queryValues = [_body.companyId,'%' + _body.query.searchKey + '%',_body.employeeId]
        }
        else {
            queryText = positionsQuery.getCompanyPositionsForBuyer +filterQuery+ sort;
            queryValues = [_body.companyId, '%' + _body.query.searchKey + '%',_body.employeeId]
        }
        
        
        const query = {
            name: 'id-fetch-company-positions',
            text: queryText,
            values: queryValues
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            var steps = results.rows
            resolve({ code: 200, message: "Positions listed successfully", data: { positions: steps } })
        })
        
    })
}

export const createCompanyPositions = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const addCompanyPositionsQuery = {
                    name: 'add-company-positions',
                    text: positionsQuery.addCompanyPositions,
                    values: [_body.positionName, _body.locationName, _body.developerCount, _body.positionCreatedCompanyId,
                        _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document, _body.contractStartDate,_body.contractDuration,
                        _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget, 
                        _body.employeeId, _body.employeeId, currentTime, currentTime, _body.jobCategoryId,_body.immediate]
                    }
                    const getCompanyNameQuery = {
                        name: 'get-company-name',
                        text: positionsQuery.getCompanyName,
                        values: [_body.positionCreatedCompanyId]
                    }
                    const getCompanyNameResponse = await client.query(getCompanyNameQuery);
                    const companyName = getCompanyNameResponse.rows[0].companyName
                    const company=companyName.fontsize(3).bold()
                    const positionName=_body.positionName.fontsize(3).bold()
                    const locationName=_body.locationName.fontsize(3).bold()
                    const companyPositionResponse = await client.query(addCompanyPositionsQuery);
                    const positionId = companyPositionResponse.rows[0].position_id
                    const companyId = _body.positionCreatedCompanyId
                    
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
                } finally {
                    client.release();
                }
            })().catch(e => {
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} })
            })
        })
    }
    
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
            
            export const updateCompanyPositions = async (_body) => {
                return new Promise((resolve, reject) => {
                    const currentTime = Math.floor(Date.now() / 1000);
                    const positionId = _body.positionId;
                    (async () => {
                        const client = await database().connect()
                        try {
                            await client.query('BEGIN');
                            const updateCompanyPositionsFirstQuery = {
                                name: 'update-company-positions-first',
                                text: positionsQuery.updatePositionFirst,
                                values: [_body.positionName, _body.locationName, _body.developerCount,
                                    _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document,
                                    _body.employeeId, currentTime, positionId, _body.positionCreatedCompanyId, _body.jobCategoryId]
                                }
                                const getCompanyNameQuery = {
                                    name: 'get-company-name',
                                    text: positionsQuery.getCompanyName,
                                    values: [_body.positionCreatedCompanyId]
                                }
                                const getCompanyNameResponse = await client.query(getCompanyNameQuery);
                                const companyName = getCompanyNameResponse.rows[0].companyName
                                await client.query(updateCompanyPositionsFirstQuery);
                                
                                const updateCompanyPositionsSecondQuery = {
                                    name: 'update-company-positions-second',
                                    text: positionsQuery.updatePositionSecond,
                                    values: [_body.contractStartDate,
                                        _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget,
                                        _body.employeeId, currentTime, positionId, _body.positionCreatedCompanyId,_body.contractDuration,_body.immediate]
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
                    
                    
                    export const publishCompanyPositions = async (_body) => {
                        return new Promise((resolve, reject) => {
                            const currentTime = Math.floor(Date.now() / 1000);
                            (async () => {
                                const client = await database().connect()
                                try {
                                    await client.query('BEGIN');
                                    var readHTMLFile = function(path, callback) {
                                        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                                            if (err) {
                                                throw err;
                                                callback(err);
                                            }
                                            else {
                                                callback(null, html);
                                            }
                                        });
                                    };
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
                                    const message = `A new position named ${positionName} has been created by ${companyName}.`
                                    var cName=companyName
                                    var cpName=positionName
                                    var msg= 'A new position named'+' '+cpName+' '+'has been created by'+' '+cName
                                    await createNotification({ positionId, jobReceivedId, companyId, message, candidateId: null, notificationType: 'position' })
                                    var subject='New position notification'
                                    readHTMLFile('src/emailTemplates/positionCreationText.html', function(err, html) {
                                        var template = handlebars.compile(html);
                                        var replacements = {
                                            company:cName,
                                            position:cpName,
                                            cId:companyId,
                                            pId:positionId
                                            
                                        };
                                        var htmlToSend = template(replacements);
                                        sendMail(config.adminEmail, subject,htmlToSend, function (err, data) {
                                            if (err) {
                                                console.log(err)
                                                reject({ code: 400, message: "Database Error", data: {} });
                                                return;
                                            }
                                            console.log('Notification mail to admin has been sent !!!');
                                            // resolve({ code: 200, message: "User Approval Successfull", data: {} });
                                        });
                                    })
                                    resolve({ code: 200, message: "Position published successfully", data: {} });
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
                    export const changeJobStatus = (_body) => {
                        return new Promise((resolve, reject) => {
                            const currentTime = Math.floor(Date.now() / 1000);
                            var jobReceivedId;
                            var message;
                            var positionName
                            var positionId
                            (async () => {
                                const client = await database().connect()
                                
                                try {
                                    await client.query('BEGIN');
                                    
                                    var readHTMLFile = function(path, callback) {
                                        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                                            if (err) {
                                                throw err;
                                                callback(err);
                                            }
                                            else {
                                                callback(null, html);
                                            }
                                        });
                                    };
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
                                                        readHTMLFile('src/emailTemplates/positionReopenText.html', function(err, html) {
                                                            var template = handlebars.compile(html);
                                                            var replacements = {
                                                                position:positionName
                                                            };
                                                            var htmlToSend = template(replacements);
                                                            var subj="Position Reopen Notification"
                                                            sendMail(emailAddress, subj, htmlToSend, function (err, data) {
                                                                if (err) {
                                                                    console.log(err)
                                                                    reject({ code: 400, message: "Mailer Error.", data: {} });
                                                                    return;
                                                                }
                                                            });
                                                        })
                                                    })
                                                }
                                                else if(_body.jobStatus==8)
                                                {
                                                    message=`A position named ${positionName} has been closed.`
                                                    
                                                }   
                                            }
                                        })
                                    })
                                    await createNotification({ positionId:_body.positionId, jobReceivedId, companyId:_body.companyId, message, candidateId: null, notificationType: 'positionList' })
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
                    export const getCompanies = (_body) => {
                        return new Promise((resolve, reject) => {
                            const CompanyQuery = {
                                name: 'get-company-names',
                                text: positionsQuery.getNames,
                                values: {'accounttype': _body.accountType},
                            }
                            database().query(CompanyQuery, (error, results) => {
                                if (error) {
                                    console.log(error)
                                    reject({ code: 400, message: "Error in database connection.", data: {} });
                                    return;
                                }
                                resolve({ code: 200, message: "Companies listed successfully", data: { companies: results.rows } });
                                
                                
                            })
                        })
                    }
                    
                    
                    export const deletePositions = (_body) => {
                        return new Promise((resolve, reject) => {
                            (async () => {
                                const client = await database().connect()
                                try {
                                    await client.query('BEGIN');
                                    var readHTMLFile = function(path, callback) {
                                        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                                            if (err) {
                                                throw err;
                                                callback(err);
                                            }
                                            else {
                                                callback(null, html);
                                            }
                                        });
                                    };
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
                                    readHTMLFile('src/emailTemplates/positionDeletionText.html', function(err, html) {
                                        var template = handlebars.compile(html);
                                        var replacements = {
                                            position:positionName
                                        };
                                        var htmlToSend = template(replacements);
                                        sendMail(emailAddress, config.PositionText.subject, htmlToSend, function (err, data) {
                                            if (err) {
                                                console.log(err)
                                                reject({ code: 400, message: "Mailer Error.", data: {} });
                                                return;
                                            }
                                            console.log(positionName,emailAddress)
                                        });
                                    })
                                    const message=`The position named ${positionName} with id ${positionId} has been removed .`
                                    await createNotification({ positionId, jobReceivedId, companyId:_body.companyId, message, candidateId: null, notificationType: 'positionList' })
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