import adminQuery from './query/admin.query';
import database from '../common/database/database';
import { sendMail } from '../middleware/mailer';
import * as passwordGenerator from 'generate-password';
import * as crypto from 'crypto';
import * as xlsxReader from 'xlsx';
import * as emailClient from '../emailService/emailService';
import * as utils from '../utils/utils';
import * as queryService from '../queryService/queryService';

export const objectToArray = (objectArray, keyName) => {
  let reqArray = [];
  objectArray.forEach((element) => {
    reqArray.push(element[keyName]);
  });
  return reqArray;
};

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>List all the users
export const listUsersDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        var selectQuery = adminQuery.listUsers;
        var totalQuery = adminQuery.listUsersTotalCount;
        var filterQuery = '',
          filter = _body.filter;
        // Search for filters in the body

        let filterResult = utils.usersFilter(filter, filterQuery);
        filterQuery = filterResult.filterQuery;
        selectQuery=selectQuery+filterQuery
        if (_body.searchKey) {
          selectQuery = selectQuery + ' ' + "AND LOWER(p.company_name) LIKE '" + _body.searchKey.toLowerCase() + "%'";
        }
        const orderBy = {
          firstName: 'e.firstname',
          lastName: 'e.lastname',
          name: 'e.firstname',
          email: 'e.email',
          phoneNumber: 'e.telephone_number',
          companyName: 'p.company_name',
          company: 'p.company_name',
          createdOn: 'e.created_on'
        };

        if (_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy)) {
          selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType;
        }
        selectQuery = selectQuery + utils.adminPagination(_body);
        const listquery = {
          name: 'list-candidates',
          text: selectQuery,
        };
        const countQuery = {
          name: 'count-total-candidates',
          text: totalQuery,
        };
        var results = await client.query(listquery);
        var counts = await client.query(countQuery);
        resolve({ code: 200, message: 'Users listed successfully', data: { Users: results.rows, totalCount: counts.rows[0].totalCount } });
      } catch (e) {
        await client.query('ROLLBACK');
        console.log('e : ', e);
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      }
    })().catch((e) => {
      console.log('e : ', e);
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>List all registered users
export const allUsersList = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        _body.queryValues = {};
        var filterQuery = '',
          filter = _body.body.filter,
          body = _body.query,
          searchKey = '%%';
        // Search for filters in the body

        let filterResult = utils.usersFilter(filter, filterQuery);
        filterQuery = filterResult.filterQuery;

        if (utils.notNull(body.searchKey)) searchKey = body.searchKey + '%';

        _body.queryValues = Object.assign({ searchkey: searchKey }, _body.queryValues);
        _body.queryCountText = adminQuery.allRegisteredUsersListCount + filterQuery;
        _body.queryText = adminQuery.allRegisteredUsersList + filterQuery + utils.userSort(body) + utils.usersPagination(body);
        console.log(_body.queryText)
        var results = await client.query(queryService.listquery(_body));
        var counts = await client.query(queryService.listQueryCount(_body));
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Users listed successfully', data: { Users: results.rows, totalCount: counts.rows[0].totalCount } });
      } catch (e) {
        await client.query('ROLLBACK');
        console.log('e : ', e);
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      }
    })().catch((e) => {
      console.log('e : ', e);
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Get details of a single user.
export const getUserDetails = (_body) => {
  return new Promise((resolve, reject) => {
    const userInfo = {
      name: 'user-Details',
      text: adminQuery.retrieveUserInfo,
      values: [_body.selectedEmployeeId],
    };
    database().query(userInfo, (error, results) => {
      if (error) {
        console.log(error, 'eror');
        reject({ code: 400, message: 'Database Error', data: {} });
        return;
      }
      const user = results.rows;
      let result = {};
      user.forEach((step) => {
        result = {
          employeeId: step.employeeId,
          firstName: step.firstName,
          lastName: step.lastName,
          email: step.email,
          accountType: step.accountType,
          companyName: step.companyName,
          companyWebsite: step.companyWebsite,
          companySize: step.companySize,
        };
        resolve({ code: 200, message: 'User details listed successfully', data: { User: result } });
      });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Function for admin to approve or reject a user who has signed up
export const clearance = (_body) => {
  return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now());
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');
        const getEllowAdmins = {
          name: 'get-ellow-admin',
          text: adminQuery.getellowAdmins,
          values: [],
        };
        var ellowAdmins = await client.query(getEllowAdmins);
        const getCompanyName = {
          name: 'get-comapny-name-from-employeeId',
          text: adminQuery.getCompanyNameQuery,
          values: [_body.selectedEmployeeId],
        };
        var companyResults = await client.query(getCompanyName);
        var companyName = companyResults.rows[0].company_name;
        var companyId = companyResults.rows[0].company_id;
        const saveRecruiter = {
          name: 'save-recruiter-id',
          text: adminQuery.saveRecruiterQuery,
          values: [_body.employeeId, companyId],
        };
        await client.query(saveRecruiter);
        const userRejectQuery = {
          name: 'admin-rejection',
          text: adminQuery.clearanceQuery,
          values: [_body.selectedEmployeeId, false, 0, currentTime],
        };
        const adminApprovalQuery = {
          name: 'admin-panel',
          text: adminQuery.approveEmployeeQuery,
          values: [_body.selectedEmployeeId, hashedPassword, currentTime],
        };
        const adminReApprovalQuery = {
          name: 'user-reapproval',
          text: adminQuery.reApproveEmployeeQuery,
          values: [_body.selectedEmployeeId, hashedPassword, currentTime],
        };
        // Approving a user
        if (_body.decisionValue == 1) {
          if (_body.repeatValue == true) {
            const password = passwordGenerator.generate({
              length: 10,
              numbers: true,
            });
            var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            var approveResult = await client.query(adminReApprovalQuery);
            var email = approveResult.rows[0].email;
            const subject = ' ellow.io LOGIN PASSWORD ';

            // Sending an email with login credentials
            let path = 'src/emailTemplates/adminReApproveText.html';
            let replacements = {
              loginPassword: password,
            };
            emailClient.emailManagerCustomerSupport(email, subject, path, replacements);

            await client.query('COMMIT');
            if (Array.isArray(ellowAdmins.rows)) {
              let recruitersSubject = 'Company Re-Approval Notification';
              let recruitersPath = 'src/emailTemplates/userReApprovalMailText.html';
              let recruitersReplacements = {
                fName: approveResult.rows[0].firstname,
                lName: approveResult.rows[0].lastname,
                email: approveResult.rows[0].email,
                cName: companyResults.rows[0].company_name,
              };
              ellowAdmins.rows.forEach((element) => {
                emailClient.emailManager(element.email, recruitersSubject, recruitersPath, recruitersReplacements);
              });
              resolve({ code: 200, message: 'User Approval Successfull', data: {} });
            }
          } else {
            const password = passwordGenerator.generate({
              length: 10,
              numbers: true,
            });
            var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            var approveResult = await client.query(adminApprovalQuery);
            var email = approveResult.rows[0].email;
            const subject = ' ellow.io LOGIN PASSWORD ';

            // Sending an email with login credentials
            let path = 'src/emailTemplates/adminApproveText.html';
            let replacements = {
              loginPassword: password,
            };

            emailClient.emailManagerCustomerSupport(email, subject, path, replacements);
            await client.query('COMMIT');
            if (Array.isArray(ellowAdmins.rows)) {
              let recruitersSubject = 'Company Approval Mail';
              let recruitersPath = 'src/emailTemplates/userApprovalMailText.html';
              let recruitersReplacements = {
                fName: approveResult.rows[0].firstname,
                lName: approveResult.rows[0].lastname,
                email: approveResult.rows[0].email,
                cName: companyResults.rows[0].company_name,
              };
              ellowAdmins.rows.forEach((element) => {
                emailClient.emailManager(element.email, recruitersSubject, recruitersPath, recruitersReplacements);
              });
              resolve({ code: 200, message: 'User Approval Successfull', data: {} });
            }
          }
        } else {
          if (_body.repeatValue == true) {
            var rejectResultSet = await client.query(userRejectQuery);
            if (rejectResultSet.rows[0].account_type == 1) {
              var employeeCompany = rejectResultSet.rows[0].company_id;
              await client.query(queryService.closeHirerPositions(employeeCompany));
            }

            var userCompanyId = rejectResultSet.rows[0].company_id;
            const subUserRejectQuery = {
              name: 'admin-subuser-rejection',
              text: adminQuery.subUserClearanceQuery,
              values: [userCompanyId, false, 0, currentTime],
            };
            await client.query(subUserRejectQuery);
            var employeeMail = rejectResultSet.rows[0].email;
            var desc = _body.description;
            var reRejectionSubject = 'ellow.io ACCOUNT REJECTION MAIL ';

            // Rejection mail to the user
            let reRejectionpath = 'src/emailTemplates/adminReRejectText.html';
            var reRejectionReplacements = {
              description: desc,
            };
            emailClient.emailManagerCustomerSupport(employeeMail, reRejectionSubject, reRejectionpath, reRejectionReplacements);

            if (Array.isArray(ellowAdmins.rows)) {
              let subject = 'Company Rejection Notification';
              let path = 'src/emailTemplates/userReRejectionMailText.html';
              let replacements = {
                fName: rejectResultSet.rows[0].firstname,
                lName: rejectResultSet.rows[0].lastname,
                email: rejectResultSet.rows[0].email,
                cName: companyResults.rows[0].company_name,
              };
              ellowAdmins.rows.forEach((element) => {
                emailClient.emailManager(element.email, subject, path, replacements);
              });
              resolve({ code: 200, message: 'User Rejection Successfull', data: {} });
            }
          } else {
            // Rejecting a user
            var rejectResultSet = await client.query(userRejectQuery);

            var employeeMail = rejectResultSet.rows[0].email;
            var desc = _body.description;
            var subject = 'ellow.io ACCOUNT REJECTION MAIL ';
            // Rejection mail to the user
            let path = 'src/emailTemplates/adminRejectText.html';
            var userReplacements = {
              description: desc,
            };
            emailClient.emailManagerCustomerSupport(employeeMail, subject, path, userReplacements);
            await client.query('COMMIT');
            if (Array.isArray(ellowAdmins.rows)) {
              let subject = 'Company Rejection Notification';
              let path = 'src/emailTemplates/userRejectionMailText.html';
              let replacements = {
                fName: rejectResultSet.rows[0].firstname,
                lName: rejectResultSet.rows[0].lastname,
                email: rejectResultSet.rows[0].email,
                cName: companyResults.rows[0].company_name,
              };
              ellowAdmins.rows.forEach((element) => {
                emailClient.emailManager(element.email, subject, path, replacements);
              });
              resolve({ code: 200, message: 'User Rejection Successfull', data: {} });
            }
          }
          await client.query('COMMIT');
        }
      } catch (e) {
        await client.query('ROLLBACK');
        console.log(e);
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      } finally {
        client.release();
      }
    })().catch((e) => {
      console.log(e);
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new job category
export const addJobCategory = (_body) => {
  return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now());
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        if (!['', undefined, null].includes(_body.jobCategoryName)) {
          // Add a new job category
          const addNewJobCategory = {
            name: 'add-new-job-category',
            text: adminQuery.addNewJobCategory,
            values: [_body.jobCategoryName, currentTime],
          };
          let jobCategoryResult = await client.query(addNewJobCategory);
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Job category added successfully', data: { jobCategoryId: jobCategoryResult.rows[0].job_category_id } });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Provide a valid job category name' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new job category
export const deleteJobCategory = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        if (utils.notNull(_body.jobCategoryId)) {
          if (utils.notNull(_body.forceRemove) && _body.forceRemove) await client.query(queryService.deleteJobCategory(_body));
          else {
            let result1 = await client.query(queryService.getJobCategoryPositionLinks(_body));
            let result2 = await client.query(queryService.getJobCategoryCandidateLinks(_body));

            if (result1.rowCount > 0 || result2.rowCount > 0) {
              reject({ code: 400, message: 'There are some positions or candidate linked to this job category', data: { positionLinks: result1.rows, candidateLinks: result2.rows } });
            } else {
              await client.query(queryService.deleteJobCategory(_body));
              resolve({ code: 200, message: 'Job category removed successfully', data: {} });
            }
          }
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Job category removed successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Provide a valid job category' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new job category
export const editJobCategory = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        if (utils.notNull(_body.jobCategoryId)) {
          await client.query(queryService.editJobCategory(_body));
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Job category updated successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Provide a valid job category' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new job category
export const editSkill = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        if (utils.notNull(_body.skillId)) {
          await client.query(queryService.editSkill(_body));
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Skill updated successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Provide a valid skill id' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new job category
export const removeSkillsFromJobCategory = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');

        if (utils.notNull(_body.jobCategoryId) && utils.notNull(_body.skillId) && Array.isArray(_body.skillId)) {
          console.log('skillId : ', _body.skillId);

          await client.query(queryService.removeSkillsFromJobCategory(_body));

          await client.query('COMMIT');
          resolve({ code: 200, message: 'Removed skills from job category successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Provide valid job category and skills' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Remove skills
export const removeSkills = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        if (utils.notNull(_body.skillId)) {
          if (utils.notNull(_body.forceRemove) && _body.forceRemove) await client.query(queryService.removeSkill(_body));
          else {
            let result1 = await client.query(queryService.getSkillPositionLinks(_body));
            let result2 = await client.query(queryService.getSkillCandidateLinks(_body));

            if (result1.rowCount > 0 || result2.rowCount > 0) {
              reject({ code: 400, message: 'There are some positions or candidate linked to this skill', data: { positionLinks: result1.rows, candidateLinks: result2.rows } });
            } else {
              await client.query(queryService.removeSkill(_body));
              resolve({ code: 200, message: 'Skill removed successfully', data: {} });
            }
          }

          await client.query('COMMIT');
          resolve({ code: 200, message: 'Removed skills successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Provide valid skill id in an array' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new skills
export const addSkills = (_body) => {
  return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now());
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');
        let skills = _body.skill,
          jobCategoryId = _body.jobCategoryId;

        if (Array.isArray(skills) && skills.length && Number.isInteger(jobCategoryId)) {
          skills = skills.filter((data) => !['', undefined, null].includes(data));

          // Add new skills
          const addNewSkills = {
            name: 'add-new-skills',
            text: adminQuery.addNewSkills,
            values: [skills, currentTime],
          };
          let skillIdReuslt = await client.query(addNewSkills);
          let skillIds = objectToArray(skillIdReuslt.rows, 'newskill');

          // Add skills under respective jobcategory id
          const addNewJobSkills = {
            name: 'add-new-job-skills',
            text: adminQuery.addJobSkill,
            values: [jobCategoryId, skillIds, currentTime],
          };
          await client.query(addNewJobSkills);
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Skills added to job category successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Invalid input data, check inputs' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Extract skills from an excel file
export const extractSkillsFromExcel = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      const currentTime = Math.floor(Date.now());

      try {
        if (!_body) {
          reject({ code: 400, message: 'File not available for extraction', data: {} });
        }

        const myFile = _body.file;

        const file = xlsxReader.read(myFile.data);
        let jobSkill = [],
          allJobSkills = {},
          jobCategoryName = [],
          promise = [];

        const sheets = file.SheetNames;

        sheets.forEach((sheetName) => {
          const temp = xlsxReader.utils.sheet_to_json(
            // Fetch data in each sheets
            file.Sheets[sheetName],
          );

          // Push skill data in each sheet to corresponding jobSkill Array and entire skill Array
          temp.forEach((res) => {
            jobSkill.push(res['SkillName']);
          });

          // Push the sheetnames to jobCategoryName array
          jobCategoryName.push(sheetName);

          // Add each jobSkill Array to aggregated array
          allJobSkills[sheetName] = jobSkill;

          // Empty the jobSkill array which pertains to each jobCategory
          jobSkill = [];
        });

        const addNewJobCategory = {
          name: 'add-new-job-category-after-compare',
          text: adminQuery.addJobCategoryWithComparison,
          values: [jobCategoryName, currentTime],
        };
        let jobCategoryNameResult = await client.query(addNewJobCategory);
        await client.query('COMMIT');

        jobCategoryNameResult.rows.forEach(async (element) => {
          let reqSkills = allJobSkills[element.newjobname];
          const addNewSkills = {
            name: 'add-new-skills',
            text: adminQuery.addNewSkills,
            values: [reqSkills, currentTime],
          };

          let skillIdReuslt = await client.query(addNewSkills);
          let skillIds = objectToArray(skillIdReuslt.rows, 'newskill');

          // Add skills under respective jobcategory id
          const addNewJobSkills = {
            name: 'add-new-job-skills',
            text: adminQuery.addJobSkill,
            values: [element.newjobid, skillIds, currentTime],
          };
          await client.query(addNewJobSkills);

          await client.query('COMMIT');
        });

        resolve({ code: 200, message: 'Users listed successfully', data: allJobSkills });
      } catch (e) {
        await client.query('ROLLBACK');
        console.log('e : ', e);
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      }
    })().catch((e) => {
      console.log('e : ', e);
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new skills
export const allSkills = (_body) => {
  return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now());
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');

        if (_body.userRoleId == 1) {
          console.log(_body.userRoleId);
          const allSkills = {
            name: 'get-all-skills',
            text: adminQuery.allSkills,
          };
          let result = await client.query(allSkills);
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Skills fetched', data: result['rows'] });
        } else {
          reject({ code: 400, message: 'Unauthorized User', data: {} });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Fetch recruiter reports
export const reports = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        let dateRangeCandidate = '',
          dateRangePosition = '',
          dateRangeCandidatePosition = '',
          dateRangeCompanyReg = '',
          dateRangeFreelancer = '';

        let groupByCandidate = ` group by ("RecruiterName", "CandidateStatus") `,
          groupByPosition = ` group by ("RecruiterName", "PositionStatus") `,
          groupByCandidatePosition = ` group by ("RecruiterName") `,
          groupByCompanyReg = `group by "assesedBy", "adminApproveStatus" order by "assesedBy","status"`,
          groupByFreelancer = `group by "candidateStatus", allocated_to order by allocated_to, "candidateStatus" desc`;

        if (utils.notNull(_body.fromDate) && utils.notNull(_body.toDate)) {
          dateRangeCandidate = ` and ca.created_on between ${_body.fromDate} and ${_body.toDate} `;
          dateRangePosition = ` and p.created_on between ${_body.fromDate} and ${_body.toDate} `;
          dateRangeCandidatePosition = ` and cp.created_on between ${_body.fromDate} and ${_body.toDate} `;
          dateRangeCompanyReg = `where "updatedDate" between ${_body.fromDate} and ${_body.toDate}`;
          dateRangeFreelancer = `and c.created_on between ${_body.fromDate} and ${_body.toDate}`;
        }

        let cpResults = await client.query(queryService.fetchCandidatePositionReports(dateRangeCandidatePosition, groupByCandidatePosition));
        let pResults = await client.query(queryService.fetchPositionReports(dateRangePosition, groupByPosition));
        let cResults = await client.query(queryService.fetchCandidateReports(dateRangeCandidate, groupByCandidate));
        let crResults = await client.query(queryService.fetchCompanyRegReports(dateRangeCompanyReg, groupByCompanyReg));
        let fResults = await client.query(queryService.fetchFreelancerReports(dateRangeFreelancer, groupByFreelancer));

        let data = {
          CandidatePositionReports: cpResults.rows,
          PositionReports: pResults.rows,
          CandidateReports: cResults.rows,
          CompanyRegistrationReports: crResults.rows,
          FreelancerReports: fResults.rows,
        };

        await client.query('COMMIT');
        resolve({ code: 200, message: 'Reports fetched successfully', data });
      } catch (e) {
        await client.query('ROLLBACK');
        console.log(e);
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};

//>>>>>>> FUNC. >>>>>>>
//>>>>>>>>>> Add new job category
export const deleteResource = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        if (utils.notNull(_body.candidateId)) {
          if (utils.notNull(_body.forceRemove) && _body.forceRemove) await client.query(queryService.removeResource(_body));
          else {
            let pLinks = await client.query(queryService.getResourcePositionLinks(_body));
            if (pLinks.rowCount > 0) {
              reject({ code: 400, message: 'There are some positions  this resource is linked to', data: { positionLinks: pLinks.rows } });
            } else {
              await client.query(queryService.removeResource(_body));
              resolve({ code: 200, message: 'Resource removed successfully', data: {} });
            }
          }

          await client.query('COMMIT');
          resolve({ code: 200, message: 'Removed Resource successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Failed. Please try again.', data: 'Provide valid canidate id' });
        }
      } catch (e) {
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again.', data: e.message });
    });
  });
};
