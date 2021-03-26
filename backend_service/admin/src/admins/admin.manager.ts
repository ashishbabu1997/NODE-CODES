import adminQuery from './query/admin.query';
import database from '../common/database/database';
import { sendMail } from '../middleware/mailer'
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import * as xlsxReader from 'xlsx';
import * as emailClient from '../emailService/emailService';
import * as utils from '../utils/utils';
import * as queryService from '../queryService/queryService';

export const objectToArray = (objectArray,keyName) => {
    let reqArray = [];
    objectArray.forEach(element => {
        reqArray.push(element[keyName])
    });
    return reqArray;
}

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>List all the users
export const listUsersDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                var selectQuery = adminQuery.listUsers;
                var totalQuery=adminQuery.listUsersTotalCount;
                if (_body.searchKey) {
                    selectQuery = selectQuery + " " + "AND LOWER(p.company_name) LIKE '" + _body.searchKey.toLowerCase()+ "%'";
                }
                const orderBy = {
                    "firstName":'e.firstname',
                    "lastName":'e.lastname',
                    "name":'e.firstname',
                    "email":'e.email',
                    "phoneNumber":'e.telephone_number',
                    "companyName":'p.company_name',
                    "company":'p.company_name'
                    
                }
                
                if(_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy))  
                {
                    selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
                }  
                selectQuery=selectQuery+utils.adminPagination(_body)
                console.log(selectQuery)
                const listquery = {
                    name: 'list-candidates',
                    text: selectQuery
                }
                const countQuery = {
                    name: 'count-total-candidates',
                    text: totalQuery
                }
                var results=await client.query(listquery)
                var counts=await client.query(countQuery)
                resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows,totalCount:counts.rows[0].totalCount } });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log("e : ",e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            }
        })().catch(e => {
            console.log('e : ',e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}




// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>List all registered users 
export const allUsersList = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                _body.queryValues={};
                var filterQuery='', filter=_body.body.filter,
                body=_body.query, searchKey = '%%';
                // Search for filters in the body        
                let filterResult = utils.usersFilter(filter,filterQuery,_body.queryValues);
                filterQuery = filterResult.filterQuery;
                _body.queryValues = filterResult.queryValues;
                var selectQuery = adminQuery.registeredUsersList;
                if(![undefined,null].includes(body.searchKey))
                {
                    searchKey= body.searchKey + '%';
                } 
                if(body.usersType)
                {         
                    _body.queryText=selectQuery+filterQuery+utils.userSort(body)+utils.usersPagination(body)
                    _body.queryCountText=adminQuery.registeredUsersListCount+filterQuery
                    _body.queryValues =Object.assign({searchkey:searchKey,userstype:body.usersType},_body.queryValues)
                    
                }
                else{
                    _body.queryValues =   Object.assign({searchkey:searchKey},_body.queryValues)
                    _body.queryCountText=adminQuery.allRegisteredUsersListCount+filterQuery,
                    _body.queryText=adminQuery.allRegisteredUsersList+filterQuery+utils.userSort(body)+utils.usersPagination(body)
                    
                }
                console.log("QUeryTExt",_body.queryText)
                console.log("QUeryValues",_body.queryValues)
                
                var results=await client.query(queryService.listquery(_body))
                var counts=await client.query(queryService.listQueryCount(_body))
                console.log(results.rows)
                resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows,totalCount:counts.rows[0].totalCount } });
                
            } catch (e) {
                await client.query('ROLLBACK')
                console.log("e : ",e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                
            }
            
        })().catch(e => {
            console.log('e : ',e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get details of a single user.
export const getUserDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const userInfo = {
            name: 'user-Details',
            text: adminQuery.retrieveUserInfo,
            values: [_body.selectedEmployeeId]
        }
        database().query(userInfo, (error, results) => {
            if (error) {
                console.log(error, "eror")
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            const user = results.rows
            let result = {};
            user.forEach(step => {
                result = {
                    employeeId: step.employeeId,
                    firstName: step.firstName,
                    lastName: step.lastName,
                    email: step.email,
                    accountType: step.accountType,
                    companyName: step.companyName,
                    companyWebsite: step.companyWebsite,
                    companySize: step.companySize
                }
                resolve({ code: 200, message: "User details listed successfully", data: { User: result } });
            })
        })
    })
}



// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Function for admin to approve or reject a user who has signed up
export const clearance = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const  getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: adminQuery.getellowAdmins,
                    values: []
                    
                    
                }
                var ellowAdmins=await client.query(getEllowAdmins)
                const  getCompanyName = {
                    name: 'get-comapny-name-from-employeeId',
                    text: adminQuery.getCompanyNameQuery,
                    values: [_body.selectedEmployeeId]
                    
                    
                }
                var companyName=await client.query(getCompanyName)
                
                // Approving a user
                if (_body.decisionValue == 1) {
                    
                    const password = passwordGenerator.generate({
                        length: 10,
                        numbers: true
                    });
                    var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                    const adminApprovalQuery = {
                        name: 'admin-panel',
                        text: adminQuery.approveEmployeeQuery,
                        values: [_body.selectedEmployeeId,hashedPassword,currentTime]
                    }
                    var approveResult = await client.query(adminApprovalQuery);
                    var email = approveResult.rows[0].email;
                    const subject = " ellow.io LOGIN PASSWORD "
                    
                    // Sending an email with login credentials
                    let path = 'src/emailTemplates/adminApproveText.html';
                    let replacements = {
                        loginPassword: password
                    };
                    emailClient.emailManager(email,subject,path,replacements);
                    await client.query('COMMIT');
                    if(Array.isArray(ellowAdmins.rows))
                    {
                        let recruitersSubject='User Registration Notification'
                        let recruitersPath = 'src/emailTemplates/userApprovalMailText.html';
                        let recruitersReplacements = { fName:approveResult.rows[0].firstname,lName:approveResult.rows[0].lastname,email:approveResult.rows[0].email,cName:companyName.rows[0].company_name};
                        ellowAdmins.rows.forEach(element => {
                            emailClient.emailManager(element.email,recruitersSubject,recruitersPath,recruitersReplacements);         
                        })
                        resolve({ code: 200, message: "User Approval Successfull", data: {} });                            
                    }
                }
                else {
                    
                    // Rejecting a user
                    const adminRejectQuery = {
                        name: 'admin-panel',
                        text: adminQuery.clearanceQuery,
                        values: [_body.selectedEmployeeId, false, 0,currentTime]
                    }
                    var rejectResultSet= await client.query(adminRejectQuery);
                    var employeeMail=rejectResultSet.rows[0].email
                    var desc = _body.description
                    var subject = "ellow.io ACCOUNT REJECTION MAIL "
                    
                    // Rejection mail to the user
                    let path = 'src/emailTemplates/adminRejectText.html';
                    var userReplacements = {
                        description: desc
                    };
                    emailClient.emailManager(employeeMail,subject,path,userReplacements);
                    await client.query('COMMIT'); 
                    if(Array.isArray(ellowAdmins.rows))
                    {
                        let subject='User Rejection Notification'
                        let path = 'src/emailTemplates/userRejectionMailText.html';
                        let replacements = { fName:rejectResultSet.rows[0].firstname,lName:rejectResultSet.rows[0].lastname,email:rejectResultSet.rows[0].email,cName:companyName.rows[0].company_name};
                        ellowAdmins.rows.forEach(element => {
                            console.log(element.email)
                            emailClient.emailManager(element.email,subject,path,replacements);         
                        })
                        resolve({ code: 200, message: "User Rejection Successfull", data: {} });
                    }
                }
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

//>>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>> Add new job category
export const addJobCategory = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                
                if(!["",undefined,null].includes(_body.jobCategoryName))
                {
                    // Add a new job category
                    const addNewJobCategory = {
                        name: 'add-new-job-category',
                        text: adminQuery.addNewJobCategory,
                        values: [_body.jobCategoryName,currentTime]
                    }
                    let jobCategoryResult = await client.query(addNewJobCategory);
                    await client.query('COMMIT');
                    resolve({ code: 200, message: "Job category added successfully", data: {jobCategoryId : jobCategoryResult.rows[0].job_category_id} });
                }
                
                else
                {
                    reject({ code: 400, message: "Failed. Please try again.", data: "Provide a valid job category name"});
                }
                
            } catch (e) {
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message});
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


//>>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>> Add new skills
export const addSkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                let skills =  _body.skill,jobCategoryId = _body.jobCategoryId;
                
                if(Array.isArray(skills) && skills.length && Number.isInteger(jobCategoryId) )
                {
                    skills = skills.filter((data) => !["",undefined,null].includes(data))
                    
                    // Add new skills
                    const addNewSkills = {
                        name: 'add-new-skills',
                        text: adminQuery.addNewSkills,
                        values: [skills,currentTime]
                    }
                    let skillIdReuslt = await client.query(addNewSkills);
                    let skillIds = objectToArray(skillIdReuslt.rows,"newskill");
                    
                    // Add skills under respective jobcategory id
                    const addNewJobSkills = {
                        name: 'add-new-job-skills',
                        text: adminQuery.addJobSkill,
                        values: [jobCategoryId,skillIds,currentTime]
                    }
                    await client.query(addNewJobSkills);
                    await client.query('COMMIT');
                    resolve({ code: 200, message: "Skills added to job category successfully", data: {} });
                }
                else
                {
                    reject({ code: 400, message: "Failed. Please try again.", data: "Invalid input data, check inputs" });
                }
                
            } catch (e) {
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
//>>>>>>>>>>>>>>>>>>Extract skills from an excel file
export const extractSkillsFromExcel = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            const currentTime = Math.floor(Date.now());
            
            try {    
                if (!_body) {
                    reject({ code: 400, message: "File not available for extraction", data: {} });
                }           
                
                const myFile =_body.file;
                       
                const file = xlsxReader.read(myFile.data) 
                let jobSkill = [] ,allJobSkills = {}, jobCategoryName = [],promise=[];
                
                const sheets = file.SheetNames
                
                sheets.forEach((sheetName)=>{
                    const temp = xlsxReader.utils.sheet_to_json( 
                        // Fetch data in each sheets
                        file.Sheets[sheetName])                            
                        
                        // Push skill data in each sheet to corresponding jobSkill Array and entire skill Array
                        temp.forEach((res) => { jobSkill.push(res["SkillName"]); })      
                        
                        // Push the sheetnames to jobCategoryName array
                        jobCategoryName.push(sheetName);
                        
                        // Add each jobSkill Array to aggregated array
                        allJobSkills[sheetName]= jobSkill;
                        
                        // Empty the jobSkill array which pertains to each jobCategory
                        jobSkill=[];
                    });
                                        
                    const addNewJobCategory = {
                        name: 'add-new-job-category-after-compare',
                        text: adminQuery.addJobCategoryWithComparison,
                        values: [jobCategoryName,currentTime]
                    }
                    let jobCategoryNameResult = await client.query(addNewJobCategory);
                    await client.query('COMMIT');

                    jobCategoryNameResult.rows.forEach(async element => {
                        let reqSkills = allJobSkills[element.newjobname];
                        const addNewSkills = {
                            name: 'add-new-skills',
                            text: adminQuery.addNewSkills,
                            values: [reqSkills,currentTime]
                        }
                        
                        let skillIdReuslt = await client.query(addNewSkills);
                        let skillIds = objectToArray(skillIdReuslt.rows,"newskill");
                        
                        // Add skills under respective jobcategory id
                        const addNewJobSkills = {
                            name: 'add-new-job-skills',
                            text: adminQuery.addJobSkill,
                            values: [element.newjobid,skillIds,currentTime]
                        }
                        await client.query(addNewJobSkills);

                        await client.query('COMMIT');
                        
                    });
                    
                    resolve({ code: 200, message: "Users listed successfully", data:allJobSkills });
                    
                } catch (e) {
                    await client.query('ROLLBACK')
                    console.log("e : ",e)
                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                }
            })().catch(e => {
                console.log('e : ',e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} })
            })
        })
    }

    //>>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>> Add new skills
export const allSkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                
                if(_body.userRoleId==1)
                {
                    const allSkills = {
                        name: 'get-all-skills',
                        text: adminQuery.allSkills
                    }
                    let result = await client.query(allSkills);

                    await client.query('COMMIT');
                    resolve({ code: 200, message: "Skills fetched", data: result['rows'] });
                
                }
                else{
                    reject({ code: 400, message: "Unauthorized User", data:{} });
                }
                    // Add new skills
                 
                
            } catch (e) {
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