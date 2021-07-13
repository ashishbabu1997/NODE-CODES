import positionsQuery from './query/positions.query';
import database from '../common/database/database';
import { createNotification, createHirerNotifications } from '../common/notifications/notifications';
import config from '../config/config'
import * as emailClient from '../emailService/emailService';
import * as queryService from '../queryService/queryService';
import * as utils from '../utils/utils';
import { Console } from 'console';
// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get the position detils of a company
export const getCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                _body.queryText = '';
                _body.queryValues = {};
                var filterQuery = '', filter = _body.body.filter,
                    body = _body.query, reqBody = _body.body, sort = '', searchKey = '%%';
                var totalQuery = ''
                // Search for filters in the body        
                let filterResult = utils.positionFilter(filter, filterQuery, _body.queryValues);
                filterQuery = filterResult.filterQuery;
                _body.queryValues = filterResult.queryValues;

                if (![undefined, null].includes(body.searchKey)) {
                    searchKey = '%' + body.searchKey + '%';
                }

                if (reqBody.userRoleId == 1) {
                    _body.queryCountText = positionsQuery.getCompanyPositionsForAdminTotalCount + utils.positionTab(body) + filterQuery
                    _body.queryText = positionsQuery.getCompanyPositionsForAdmin + utils.positionTab(body) + filterQuery + utils.positionSort(body) + utils.positionPagination(body);
                    _body.queryValues = Object.assign({ searchkey: searchKey, employeeid: reqBody.employeeId }, _body.queryValues)
                    // Object.assign({searchkey:searchKey,employeeid:reqBody.employeeId},queryValues)
                }
                else {
                    _body.queryCountText = positionsQuery.getCompanyPositionsForBuyerTotalCount + utils.positionTab(body) + filterQuery
                    _body.queryText = positionsQuery.getCompanyPositionsForBuyer + utils.positionTab(body) + filterQuery + utils.hirerPositionSort(body) + utils.positionPagination(body);
                    _body.queryValues = Object.assign({ companyid: reqBody.companyId, searchkey: searchKey, employeeid: reqBody.employeeId }, _body.queryValues)
                }
                console.log(_body.queryText)
                let results = await client.query(queryService.fetchCompanyPositionsById(_body))
                let counts = await client.query(queryService.fetchPositionsCount(_body))
                var steps = results.rows
                resolve({ code: 200, message: "Positions listed successfully", data: { positions: steps, totalCount: counts.rows[0].totalCount } })
            } catch (e) {
                await client.query('ROLLBACK')
                console.log("e : ", e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            }
        })().catch(e => {
            console.log('e : ', e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}
// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Create a new position for a company
export const createCompanyPositions = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        _body.skillNames=[];
        _body.providerMails=[];
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let hiringStepQueries = [];
                _body.cmpId = _body.userRoleId == 1 ? _body.positionCreatedCompanyId : _body.companyId;
                let companyId = _body.cmpId
                _body.experienceInString=`${_body.experienceLevel[0]} - ${_body.experienceLevel[1]} years`
                const getCompanyNameResponse = await client.query(queryService.getCompanyNameQuery(_body))
                const companyName = getCompanyNameResponse.rows[0].companyName
                const companyPositionResponse = await client.query(queryService.addCompanyPositionsQuery(_body))
                await client.query('COMMIT')
                const positionId = companyPositionResponse.rows[0].position_id
                _body.positionId = positionId
                _body.tSkill = (![undefined, null].includes(_body.skills) && Array.isArray(_body.skills["topRatedSkills"])) ? _body.skills["topRatedSkills"].map(a => a.skillId) : [];
                _body.oSkill = (![undefined, null].includes(_body.skills) && Array.isArray(_body.skills["otherSkills"])) ? _body.skills["otherSkills"].map(a => a.skillId) : [];

                if (_body.tSkill.length > 0) {
                    await client.query(queryService.addTopSkillsQuery(_body))
                }
                if (_body.oSkill.length > 0) {
                    await client.query(queryService.addOtherSkillsQuery(_body))
                }
                await client.query('COMMIT')

                if (![null, undefined, ''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps)) {
                    let order = 1;
                    _body.hiringSteps.forEach(element => {
                        const insertHiringStepsQuery = {
                            name: 'add-hiring-steps',
                            text: positionsQuery.insertHiringSteps,
                            values: [positionId, element.hiringStepName, element.hiringStepType, order, _body.employeeId, Date.now(), element.hiringAssesmentName, element.hiringAssesmentType, element.default],
                        }
                        hiringStepQueries.push(client.query(insertHiringStepsQuery));
                        order++;
                    });
                }
                await Promise.all(hiringStepQueries);
                if (_body.publish == true) {
                    await client.query(queryService.changePositionStatusQuery(_body))
                
                    const data = await client.query(queryService.addPositionToJobReceivedQuery(_body));
                    const jobReceivedId = data.rows[0].job_received_id;
                    const details = await client.query(queryService.getNotificationDetailsQuery(_body));
                    const message = `A new position,${details.rows[0].positionName} has been created by ${details.rows[0].companyName}`

                    var cName = details.rows[0].companyName
                    var cpName = details.rows[0].positionName
                    if (_body.userRoleId == 1) {
                        _body.allocatedTo = _body.employeeId;
                        const hirerMessage = `New position, ${details.rows[0].positionName} has been created for you by ellow.io admin`
                        await createHirerNotifications({ positionId, jobReceivedId, companyId: _body.cmpId, message: hirerMessage, candidateId: null, notificationType: 'position', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                        await client.query(queryService.assigneeQuery(_body));
                    if (_body.typeOfJob==0 || _body.typeOfJob==1)
                    {
                        var providers=await client.query(queryService.getAllProviders(_body))
                        var jobCategory=await client.query(queryService.getJobCategoryName(_body))
                        var jobRole=jobCategory.rows[0].job_category_name
                        _body.skills.topRatedSkill.forEach  ( element =>{
                            _body.skillNames.push({skillName:element.skillName})
                       })
                        var providerReplacements={jobRole:jobRole,experienceLevel:_body.experienceInString,profiles:_body.developerCount,skills:_body.skillNames}
                        var providersPath='src/emailTemplates/newPositionAlertProviders.html';
                        if (Array.isArray(providers.rows)) {
                            providers.rows.forEach(element => {
                                _body.providerMails.push(element.email)
    
                            })
                        }
                        emailClient.multipleEmailManager(_body.providerMails, config.PositionText.providersSubject, providersPath, providerReplacements);
                    }
                    }
                    else {
                        // console.log("Hirer or provider")
                    }
                    await client.query('COMMIT');

                    await createNotification({ positionId, jobReceivedId, companyId, message, candidateId: null, notificationType: 'position', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                    var subject = 'New position notification'
                    // Sending a notification mail about position creation; to the admin
                    let path = 'src/emailTemplates/positionCreationText.html';
                    var userReplacements = {
                        company: cName,
                        position: cpName
                    };
                    var ellowAdmins = await client.query(queryService.getEllowAdmins(_body))
                    if (Array.isArray(ellowAdmins.rows)) {
                        ellowAdmins.rows.forEach(element => {
                        
                               emailClient.emailManager(element.email, subject, path, userReplacements);
                            

                        })
                    }
                }
                if (_body.flag == 0) {
                    resolve({ code: 200, message: "Positions created successfully", data: { positionId, companyName } });
                    return;
                }
                resolve({ code: 200, message: "Positions created successfully", data: { positionId, companyId } });
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
                let results = await client.query(queryService.fetchPositionDetails(_body))
                const primaryMails = await client.query(queryService.listPrimaryEmails(_body));
                const secondaryMails = await client.query(queryService.listSecondaryEmails(_body));
                const queryResult = results.rows;
                let result = {};
                queryResult.forEach(step => {
                    result = {
                        positionId: _body.positionId,
                        maxBudget: step.max_budget,
                        primaryEmails:primaryMails.rows[0].primaryEmails,
                        secondaryMails:secondaryMails.rows[0].secondaryEmails,
                        minBudget: step.min_budget,
                        billingTypeId: step.billing_type,
                        contractStartDate: step.contract_start_date,
                        contractDuration: step.contract_duration,
                        immediate: step.immediate,
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
                        companySize: step.company_size,
                        companyLogo: step.company_logo,
                        createdBy: step.createdBy,
                        fullName: step.fullName,
                        coreSkills: step.coreSkills,
                        otherSkills: step.otherSkills,
                        email: step.email,
                        positionStatus: step.job_status,
                        phoneNumber: step.phoneNumber,
                        companyLinkedinId: step.company_linkedin_id,
                        skills: step.skills,
                        tyeOfJob:step.type_of_job
                    }

                })
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
        const positionId = _body.positionId;
        const companyId = _body.userRoleId == 1 ? _body.positionCreatedCompanyId : _body.companyId;
        const timer = setTimeout(() => '', 1000);
        _body.skillNames=[];
        (async () => {
            const client = await database().connect()
            try {
                _body.cmpId = companyId
                await client.query('BEGIN');
                let hiringStepQueries = [];
                _body.experienceInString=`${_body.experienceLevel[0]} - ${_body.experienceLevel[1]} years`
                const getCompanyNameResponse = await client.query(queryService.getCompanyNameQuery(_body))
                const companyName = getCompanyNameResponse.rows[0].companyName
                await client.query(queryService.updateCompanyPositionsFirstQuery(_body))
                await client.query(queryService.updateCompanyPositionsSecondQuery(_body))
                await client.query('COMMIT')
                _body.tSkill = (![undefined, null].includes(_body.skills) && Array.isArray(_body.skills["topRatedSkills"])) ? _body.skills["topRatedSkills"].map(a => a.skillId) : [];
                _body.oSkill = (![undefined, null].includes(_body.skills) && Array.isArray(_body.skills["otherSkills"])) ? _body.skills["otherSkills"].map(a => a.skillId) : [];
                _body.skillSet = _body.tSkill.concat(_body.oSkill);
                await client.query(queryService.deleteJobSkillsQuery(_body))
                await client.query('COMMIT')
                if (_body.tSkill.length > 0) {
                    await client.query(queryService.addTopSkillsQuery(_body))
                }
                if (_body.oSkill.length > 0) {
                    await client.query(queryService.addOtherSkillsQuery(_body))
                }
                if (![null, undefined, ''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps)) {
                    let order = 1;
                    _body.hiringSteps.forEach(element => {
                        const insertHiringStepsQuery = {
                            name: 'add-hiring-steps',
                            text: positionsQuery.insertHiringSteps,
                            values: [positionId, element.hiringStepName, element.hiringStepType, order, _body.employeeId, Date.now(), element.hiringAssesmentName, element.hiringAssesmentType, element.default],
                        }
                        hiringStepQueries.push(client.query(insertHiringStepsQuery));
                        order++;
                    });
                }
                await Promise.all(hiringStepQueries);
                if (_body.publish == true) {
                    
                    var positionStatus = await client.query(queryService.checkPositionStatus(_body))
                    await client.query(queryService.changePositionStatusQuery(_body))
                    const data = await client.query(queryService.addPositionToJobReceivedQuery(_body));
                    const jobReceivedId = data.rows[0].job_received_id;
                    const details = await client.query(queryService.getNotificationDetailsQuery(_body));
                    const { positionCompanyId, positionCompanyName, positionName } = details.rows[0];
                    const message = `A new position,${positionName} has been created by ${details.rows[0].companyName}`
                    var cName = details.rows[0].companyName
                    var cpName = positionName
                    if (_body.userRoleId == 1) {
                        _body.allocatedTo = _body.employeeId;
                        const hirerMessage = `New position, ${details.rows[0].positionName} has been created for you by ellow.io admin`
                        await createHirerNotifications({ positionId, jobReceivedId, companyId, message: hirerMessage, candidateId: null, notificationType: 'position', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                        await client.query(queryService.assigneeQuery(_body));
                    }
                  
                    await client.query('COMMIT');

                    await createNotification({ positionId, jobReceivedId, positionCompanyId, message, candidateId: null, notificationType: 'position', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                    // var subject = 'New position notification'
                    // // Sending a notification mail about position creation; to the admin
                    // let path = 'src/emailTemplates/positionCreationText.html';
                    // var userReplacements = {
                    //     company: cName,
                    //     position: cpName
                    // };
                    // if (_body.typeOfJob==0 || _body.typeOfJob==1)
                    // {
                    //     var providers=await client.query(queryService.getAllProviders(_body))
                    //     var jobCategory=await client.query(queryService.getJobCategoryName(_body))
                    //     var jobRole=jobCategory.rows[0].job_category_name
                    //     _body.coreSkills.forEach  ( element =>{
                    //          _body.skillNames.push({skillName:element})
                    //     })


                        // var providerReplacements={jobRole:jobRole,experienceLevel:_body.experienceInString,profiles:_body.developerCount,skills:_body.skillNames}
                        // var providersPath='src/emailTemplates/newPositionAlertProviders.html';
                        // _body.providerMails=[]
                        // if (Array.isArray(providers.rows)) {
                        //     providers.rows.forEach(element => {
                        //         _body.providerMails.push(element.email)
    
                        //     })
                        // }
                        // emailClient.multipleEmailManager(_body.providerMails, config.PositionText.providersSubject, providersPath, providerReplacements);
    
                          
                    // }
                    // var ellowAdmins = await client.query(queryService.getEllowAdmins(_body))
                    // if (Array.isArray(ellowAdmins.rows)) {
                    //     ellowAdmins.rows.forEach(element => {
                    //         if (element.email != null || '' || undefined) {
                    //             emailClient.emailManagerForNoReply(element.email, subject, path, userReplacements);
                    //         }
                    //         else {
                    //             console.log("Email Recipient is empty")
                    //         }

                    //     })
                    // }
                    if (positionStatus.rows[0].job_status == 5) {
                        await client.query(queryService.deleteReadStatusQuery(_body))

                    }
                }

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

            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Publish the position details so that it will be visible to all other users (providers)
export const publishCompanyPositions = async (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const positionId = _body.positionId;
                await client.query(queryService.changePositionStatusQuery(_body))
                const data = await client.query(queryService.addPositionToJobReceivedQuery(_body));
                const jobReceivedId = data.rows[0].job_received_id;
                const details = await client.query(queryService.getNotificationDetailsQuery(_body));

                if (_body.userRoleId == 1) {
                    _body.allocatedTo = _body.employeeId;
                    await client.query(queryService.assigneeQuery(_body));
                }

                await client.query('COMMIT');
                const { companyId, companyName, positionName } = details.rows[0];
                const message = `A new position,${positionName} has been created by ${companyName}`
                var cName = companyName
                var cpName = positionName
                await createNotification({ positionId, jobReceivedId, companyId, message, candidateId: null, notificationType: 'position', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                var subject = 'New position notification'
                // Sending a notification mail about position creation; to the admin
                let path = 'src/emailTemplates/positionCreationText.html';
                var userReplacements = {
                    company: cName,
                    position: cpName
                };
                var ellowAdmins = await client.query(queryService.getEllowAdmins(_body))
                if (Array.isArray(ellowAdmins.rows)) {
                    ellowAdmins.rows.forEach(element => {
                        if (element.email != null || '' || undefined) {
                            emailClient.emailManagerForNoReply(element.email, subject, path, userReplacements);
                        }
                        else {
                            console.log("Email Recipient is empty")
                        }

                    })
                    resolve({ code: 200, message: "Position published successfully", data: {} });

                }
            } catch (e) {
                console.log("Error1", e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error2", e.message)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}


// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>> Change job status for a position
export const changeJobStatus = (_body) => {
    return new Promise((resolve, reject) => {

        (async () => {
            const client = await database().connect()

            try {
                await client.query('BEGIN');
                var jobReceivedId;
                var message;
                let positionName;
                let subj;
                let userPath;
                let userReplacements;
                let adminPath;
                let adminReplacements
                let positionCompanyName;
                let userMailAddress
                var ellowAdmins = await client.query(queryService.getEllowAdmins(_body))
                await client.query(queryService.positionQuery(_body))
                await client.query(queryService.changeJobReceivedStatusQuery(_body))
                var results = await client.query(queryService.mailAddress(_body))
                jobReceivedId = results.rows[0].job_received_id
                positionName = results.rows[0].position_name
                positionCompanyName = results.rows[0].company_name
                userMailAddress = results.rows[0].email
                // If job status is 6, it means admin is reopening a position
                if (_body.jobStatus == 6) {

                    message = `A position,${positionName} has been reopened.`
                    createNotification({ positionId: _body.positionId, jobReceivedId: jobReceivedId, companyId: _body.companyId, message: message, candidateId: null, notificationType: 'position', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                    // A notification is sent to the hirer about his/her reopened position
                    if (_body.userRoleId == 1) {
                        subj = "Position Reopen Notification"
                        userPath = 'src/emailTemplates/adminToUserPositionReopen.html';
                        userReplacements = {
                            position: positionName
                        }
                        adminPath = 'src/emailTemplates/adminToAdminPositionReopen.html';
                        adminReplacements = {
                            position: positionName,
                            company: positionCompanyName
                        }
                    }
                    else {
                        subj = "Position Reopen Notification"
                        userPath = 'src/emailTemplates/userToUserPositionReopen.html';
                        userReplacements = {
                            position: positionName
                        }
                        adminPath = 'src/emailTemplates/userToAdminPositionReopen.html';
                        adminReplacements = {
                            position: positionName,
                            company: positionCompanyName
                        }
                    }
                }

                // If job status is 8,then the position is closed.
                else if (_body.jobStatus == 8) {

                    message = `A position,${positionName} has been closed.`
                    createNotification({ positionId: _body.positionId, jobReceivedId: jobReceivedId, companyId: _body.companyId, message: message, candidateId: null, notificationType: 'position', userRoleId: _body.userRoleId, employeeId: _body.employeeId })

                    subj = "Close Position Notification"
                    userPath = 'src/emailTemplates/adminToUserClosePosition.html';
                    userReplacements = {
                        position: positionName
                    }
                    adminPath = 'src/emailTemplates/adminToAdminClosePosition.html';
                    adminReplacements = {
                        position: positionName,
                        company: positionCompanyName
                    }


                }
                else {
                    console.log("Job Status out of bound")
                }
                emailClient.emailManagerForNoReply(userMailAddress, subj, userPath, userReplacements);
                if (Array.isArray(ellowAdmins.rows)) {
                    ellowAdmins.rows.forEach(element => {

                        emailClient.emailManagerForNoReply(element.email, subj, adminPath, adminReplacements);


                    })

                }
                await client.query('COMMIT');
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
        _body.query=_body.accountType==2?positionsQuery.getProviderNames:positionsQuery.getNames;
        var  CompanyQuery = {
            name: 'get-company-names',
            text: _body.query,
            values: { 'accounttype': _body.accountType },
        }
        database().query(CompanyQuery, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Error in database connection.", data: {} });
                return;
            }
            else
                resolve({ code: 200, message: "Companies listed successfully", data: { companies: results.rows } });
        })
    }).catch((err) => {
        throw ({ code: 400, message: "Error in database connection.", data: {} });
    })
}


// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Delete a position from a users position page
export const deletePositions = (_body) => {
    return new Promise((resolve, reject) => {
        var path = '';
        var adminPath = '';
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const positionId = _body.positionId;
                var employeeData = await client.query(queryService.getMailAddressofHirer(_body))
                await client.query('COMMIT');
                await client.query(queryService.deleteHirerPositions(_body))
                await client.query('COMMIT');
                var positionName = employeeData.rows[0].position_name
                var emailAddress = employeeData.rows[0].email
                var jobStatus = employeeData.rows[0].job_status
                var positionCompanyName = employeeData.rows[0].company_name
                var hirerCompanyId = employeeData.rows[0].company_id
                await client.query('COMMIT');
                adminPath = 'src/emailTemplates/positionDeletionAdminText.html';
                if (_body.userRoleId == 1) {
                    path = 'src/emailTemplates/positionDeletionText.html';
                    adminPath = 'src/emailTemplates/positionDeletionAdminText.html';
                }
                else {
                    path = 'src/emailTemplates/selfPositionDeletionText.html';
                    adminPath = 'src/emailTemplates/positionDeletionAdminSelfText.html';
                }
                var userReplacements = {
                    position: positionName
                };
                var adminReplacements = {
                    position: positionName,
                    company: positionCompanyName
                };
                if (jobStatus == 5) {
                    resolve({ code: 200, message: "Position deletion successfull", data: {} });

                }
                else {
                    emailClient.emailManagerForNoReply(emailAddress, config.PositionText.subject, path, userReplacements);
                    var ellowAdmins = await client.query(queryService.getEllowAdmins(_body))
                    if (Array.isArray(ellowAdmins.rows)) {
                        ellowAdmins.rows.forEach(element => {
                            emailClient.emailManagerForNoReply(element.email, config.PositionText.subject, adminPath, adminReplacements);

                        })
                        const message = `The position, ${positionName}  has been removed .`
                        await createHirerNotifications({ positionId, jobReceivedId: null, companyId: hirerCompanyId, message, candidateId: null, notificationType: 'positionList', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                        await createNotification({ positionId, jobReceivedId: null, companyId: _body.companyId, message, candidateId: null, notificationType: 'positionList', userRoleId: _body.userRoleId, employeeId: _body.employeeId })
                        resolve({ code: 200, message: "Position deletion successfull", data: {} });
                    }
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
    const currentTime = Math.floor(Date.now());

    return new Promise((resolve, reject) => {
        const CompanyQuery = {
            name: 'update-read-status',
            text: positionsQuery.insertReadStatus,
            values: [_body.positionId, _body.employeeId, currentTime],
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
//>>>>>>>>>>>>>>>>>>Reset read status of a position
export const resetReadStatus = (_body) => {
    return new Promise((resolve, reject) => {
        database().query(queryService.deleteReadStatusQuery(_body), (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Error in database connection.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Read status reset successfull", data: {} });
        })
    })
}




// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Change read status of a position
export const updateAllocatedTo = (_body) => {

    return new Promise((resolve, reject) => {

        database().query(queryService.assigneeQuery(_body), (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Error in database connection.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Updated allocated to of position", data: {} });
        })
    })
}