/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-duplicate-case */
/* eslint-disable no-var */
/* eslint-disable linebreak-style */
import candidateQuery from './query/candidates.query';
import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import config from '../config/config';
import * as emailService from '../emailService/candidatesEmail';
import * as passwordGenerator from 'generate-password';
import * as crypto from 'crypto';
import * as utils from '../utils/utils';
import * as rchilliExtractor from '../utils/RchilliExtractor';
import * as https from 'http';
import fetch from 'node-fetch';
import * as jwt from 'jsonwebtoken';
import * as HtmlDocx from 'html-docx-js';
import { createProviderNotifications } from '../common/notifications/notifications';
import * as dotenv from 'dotenv';
import * as emailClient from '../emailManager/emailManager';
import { nanoid } from 'nanoid';
import * as builder from '../utils/Builder';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { google } from 'googleapis';
import { hasOwnProperty } from 'tslint/lib/utils';
import { Console } from 'console';
import * as sendinblueService from '../sendinblueServices/freelancerSendinblueMails';
import { Exception } from 'handlebars';
import { isElementAccessChain } from 'typescript';

dotenv.config();

// >>>>>>> FUNC. >>>>>>>
// />>>>>>>> FUnction for listing all the candidates with his/her basic details for a given position
export const listCandidatesDetails = (_body) => {
  return new Promise((resolve, reject) => {
    const selectQuery = candidateQuery.listCandidates;

    let adminApproveQuery = '';
    let queryText = '';
    let queryValues = {};
    const body = _body.query;
    let sort = '';

    // Sorting keys to add with the query
    const orderBy = { updatedOn: `cp.updated_on` };

    if (body.userRoleId != '1') {
      adminApproveQuery = ` AND chsv."adminApproveStatus" = 1`;
    }

    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
      sort = ` ORDER BY ${orderBy[body.sortBy]} desc `;
    }

    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        queryText = selectQuery + adminApproveQuery + sort;
        console.log(queryText);
        queryValues = Object.assign({ positionid: body.positionId }, queryValues);

        const candidatesResult = await client.query(queryService.listCandidates(queryText, queryValues));
        await client.query('COMMIT');

        resolve({ code: 200, message: 'Candidate Listed successfully', data: { allCandidates: candidatesResult.rows } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>Listing all the free candidates from the candidates list.
export const listFreeCandidatesDetails = (_body) => {
  return new Promise((resolve, reject) => {
    const selectQuery = candidateQuery.listFreeCandidatesFromView;
    const totalQuery = candidateQuery.listFreeCandidatesTotalCount;
    let queryText = '';
    let searchQuery = '';
    let queryValues = {};
    let filterQuery = '';
    const filter = _body.body != undefined ? _body.body.filter : '';
    const body = _body.query;
    const reqBody = _body.body;
    body.employeeId = reqBody.employeeId;

    // Search for filters in the body
    const filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
    filterQuery = filterResult.filterQuery;
    queryValues = filterResult.queryValues;

    // Search for company name / candidate name
    const searchResult = utils.resourceSearch(body, queryValues);
    searchQuery = searchResult.searchQuery;
    queryValues = searchResult.queryValues;

    (async () => {
      const client = await database();
      try {
        const currentTime = Math.floor(Date.now());

        queryText = selectQuery + utils.resourceTab(body) + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
        queryValues = Object.assign({ positionid: body.positionId, employeeid: body.employeeId, currenttime: currentTime }, queryValues);
        const candidateList = await client.query(queryService.listCandidates(queryText, queryValues));
        const queryCountText = totalQuery + utils.resourceTab(body) + filterQuery + searchQuery;
        const candidateTotal = await client.query(queryService.listCandidatesTotal(queryCountText, queryValues));

        const candidates = candidateList.rows;
        const totalCount = candidateTotal.rows[0].totalCount;
        resolve({ code: 200, message: 'Candidate Listed successfully', data: { candidates, totalCount } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 500, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 500, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const listIncontractResources = (_body) => {
  return new Promise((resolve, reject) => {
    const selectQuery = candidateQuery.listIncontractResources;
    const totalQuery = candidateQuery.listIncontractResourcesCount;
    let queryText = '';
    let searchQuery = '';
    let queryValues = {};
    let filterQuery = '';
    const filter = _body.body != undefined ? _body.body.filter : '';
    const body = _body.query;
    const reqBody = _body.body;
    body.employeeId = reqBody.employeeId;

    // Search for filters in the body
    const filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
    filterQuery = filterResult.filterQuery;
    queryValues = filterResult.queryValues;

    // Search for company name / candidate name
    const searchResult = utils.resourceSearch(body, queryValues);
    searchQuery = searchResult.searchQuery;
    queryValues = searchResult.queryValues;
    (async () => {
      const client = await database();
      try {
        const currentTime = Math.floor(Date.now());
        let incontract = body.tabValue == 'activeIncontract' ? true : false;
        queryText = selectQuery + filterQuery + searchQuery + utils.incontractResourceSort(body) + utils.resourcePagination(body);
        queryValues = Object.assign({ positionid: body.positionId, employeeid: body.employeeId, currenttime: currentTime, incontract: incontract }, queryValues);
        const candidateList = await client.query(queryService.listCandidates(queryText, queryValues));

        const queryCountText = totalQuery + filterQuery + searchQuery;

        const candidateTotal = await client.query(queryService.listCandidatesTotal(queryCountText, queryValues));
        const candidates = candidateList.rows;
        const totalCount = candidateTotal.rows[0].totalCount;
        console.log(totalCount);
        resolve({ code: 200, message: 'Candidate Listed successfully', data: { candidates, totalCount } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 500, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 500, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>Listing required candidates for add from list from the candidates list.
export const listAddFromListCandidates = (_body) => {
  return new Promise((resolve, reject) => {
    const selectQuery = candidateQuery.getCandidateForAddFromListView;
    const totaltQuery = candidateQuery.addFromListTotalCount;
    let roleBasedQuery = '';
    let queryText = '';
    let searchQuery = '';
    let queryValues = {};
    let filterQuery = '';
    const filter = _body.body != undefined ? _body.body.filter : '';
    const body = _body.query;
    const reqBody = _body.body;
    // Search for filters in the body
    const filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
    filterQuery = filterResult.filterQuery;
    queryValues = filterResult.queryValues;

    // Search for company name / candidate name
    const searchResult = utils.resourceSearch(body, queryValues);
    searchQuery = searchResult.searchQuery;
    queryValues = searchResult.queryValues;

    // Apply query based on userRoleId
    const roleBasedQueryResult = utils.resourceRoleBased(reqBody, queryValues);
    roleBasedQuery = roleBasedQueryResult.roleBasedQuery;
    queryValues = roleBasedQueryResult.queryValues;

    (async () => {
      const client = await database();
      try {
        queryText = selectQuery + roleBasedQuery + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
        queryValues = Object.assign({ positionid: body.positionId }, queryValues);
        console.log(queryText)
        const candidatesResult = await client.query(queryService.listAddFromList(queryText, queryValues));

        queryText = totaltQuery + roleBasedQuery + filterQuery + searchQuery;

        const totalCountResult = await client.query(queryService.listAddFromListTotal(queryText, queryValues));

        resolve({ code: 200, message: 'Candidate Listed successfully', data: { candidates: candidatesResult.rows, totalCount: totalCountResult.rows[0].totalCount } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Function for admin to add reviews,assesment comments about the candidate
export const addCandidateReview = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        if (!utils.notNull(_body.assignedTo)) {
          reject(new Error({ code: 400, message: 'Candidate must be assigned to an assignee', data: {} }.toString()));
        } else {
          await client.query('BEGIN');
          // Update assesment ratings about the candidate.
          _body.ellowRecruitmentStatus = config.ellowRecruitmentStatus.complete;
          var result = await client.query(queryService.updateEllowRecuiterReview(_body));
          _body.candidateId = result.rows[0].candidate_id;
          var updateResult = await client.query(queryService.updateEllowRecruitmentStatus(_body));
          _body.ellowstatusId = updateResult.rows[0].ellow_status_id;
          if (_body.stageName == config.ellowRecruitmentStatus.verifiedStage) {
            await client.query(queryService.setVettedStatus(_body));
            await emailService.addCandidateReviewEmail(_body, client);
          }
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Candidate Assesment Updated successfully', data: {} });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Function to add code/algorithm test link by ellow recruiter
export const addTestLink = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');

        var query = await client.query(queryService.updateAssessmentTestLink(_body));
        await client.query('COMMIT');

        var result = query.rows[0];
        (_body.candidateId = result.candidate_id),
          (_body.reviewStepsId = result.review_steps_id),
          (_body.ellowRecruitmentStatus = config.ellowRecruitmentStatus.partial),
          (_body.currentEllowStage = result.review_steps_id);
        await client.query(queryService.updateEllowRecruitmentStatus(_body));
        var candidateDetailResult=await client.query(queryService.getCandidateProfileName(_body));
        _body.emailAddress=candidateDetailResult.rows[0].email
        await emailService.ellowTestLinkNotification(_body);
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate Assesment Updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>>>Function to edit the vetting status of the candidate.
export const editVettingStatus = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        // Inserting the integer representing the vetting status value.
        await client.query(queryService.updateCandidateVetting(_body));
        resolve({ code: 200, message: 'Candidate Vetting Updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Function to remove a candidate from a position by admin and sending a notification email to the provider who added this candidate.
export const removeCandidateFromPosition = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        const positionId = _body.positionId;
        await client.query('BEGIN');
        // Query to remove candidate from a position
        await client.query(queryService.removeCandidateFromPositionQuery(_body));
        // Query to to remove hiring steps of candidate
        await client.query(queryService.removeFromCandidateClientHiringStep(_body));
        await emailService.removeCandidateFromPositionEmail(_body, client);

        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate deleted successfully', data: { positionId: positionId } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>> Link the candidates to a particular position .
export const linkCandidateWithPosition = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');
        const promise = [];
        const candidateList = _body.candidates;
        const positionId = _body.positionId;
        _body.count = 0;

        // Inserting candidates to candidate_positions table
        if (_body.userRoleId == 1) {
          candidateList.forEach((element) => {
            element.employeeId = _body.employeeId;
            element.positionId = positionId;
            element.ellowRate = utils.notNull(element.ellowRate) == false ? null : element.ellowRate;
            _body.count = _body.count + 1;
            promise.push(client.query(queryService.linkCandidateByAdminQuery(element)));
          });
          await Promise.all(promise);
        } else {
          candidateList.forEach((element) => {
            element.employeeId = _body.employeeId;
            element.positionId = positionId;
            _body.count = _body.count + 1;
            promise.push(client.query(queryService.linkCandidateQuery(element)));
          });
          await Promise.all(promise);
        }
        // Adding client based hiring steps with respect to poition being linked
        for (const element of candidateList) {
          _body.candidateId = element.candidateId;
          await client.query(queryService.addCandidateHiringSteps(_body));
        }

        await client.query(queryService.updatePositionUpdatedOnAndBy(_body));
        _body.addEllowRateOnly = false;
        emailService.linkCandidateWithPositionEMail(_body, client);
        await client.query('COMMIT');

        resolve({ code: 200, message: 'Profile is shared to the given email addresses successfully', data: {} });
      } catch (e) {
        console.log('error : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      console.log('error : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>> Remove a freely added candidate.
export const removeCandidate = (_body) => {
  return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now());
    (async () => {
      const client = await database().connect();
      try {
        // Updating the status of the candidate to false.
        const deleteCandidateQuery = {
          name: 'delete-candidate',
          text: candidateQuery.deleteCandidate,
          values: [_body.candidateId, currentTime, _body.employeeId],
        };
        await client.query(deleteCandidateQuery);
        resolve({ code: 200, message: 'Candidate deleted successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Update resume file name
export const modifyResumeFile = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        if (_body.candidateId != null) {
          await client.query(queryService.updateResumeFile(_body));
          resolve({ code: 200, message: 'Candidate resume file updated successfully', data: {} });
        } else {
          const results = await client.query(queryService.updateResumeForNewEntry(_body));
          resolve({ code: 200, message: 'Candidate resume file updated successfully', data: { candidateId: results.rows[0].candidate_id } });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Update resume file name
export const modifyResumeData = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        const extractedData = rchilliExtractor.rchilliExtractor(_body);
        let candidateId = null;
        extractedData['employeeId'] = _body.employeeId;
        extractedData['resume'] = _body.resume;
        extractedData['candidateId'] = _body.candidateId;

        if (_body.candidateId) {
          await client.query(queryService.updateExtractedCandidateDetails(extractedData));
          candidateId = _body.candidateId;
        } else {
          if (_body.userRoleId == 3) {
            extractedData['companyId'] = Number(_body.companyId);
          }

          const candidateResult = await client.query(queryService.insertExtractedCandidateDetails(extractedData));
          if ([null, undefined, ''].includes(candidateResult) || [null, undefined, ''].includes(candidateResult.rows[0])) {
            console.log('error resume already uploaded');
            return reject(new Error({ code: 400, message: 'This resume is already uploaded/extracted use another resume', data: {} }.toString()));
          }

          candidateId = candidateResult.rows[0].candidate_id;
        }
        await client.query('COMMIT');
        try {
          let promises = [];

          extractedData['candidateId'] = candidateId;
          await client.query(queryService.insertExtractedCandidateSkills(extractedData));

          extractedData['workHistory'].map((data) => {
            data['candidateId'] = candidateId;
            data['employeeId'] = _body.employeeId;
            promises.push(client.query(queryService.insertCandidateWorkHistoryQuery(data)));
          });

          await Promise.all(promises);

          promises = [];
          extractedData['projects'].map((data) => {
            data['candidateId'] = candidateId;
            data['employeeId'] = _body.employeeId;
            promises.push(client.query(queryService.insertExtractedCandidateProjectsQuery(data)));
          });

          await Promise.all(promises);

          promises = [];
          extractedData['education'].map((data) => {
            data['candidateId'] = candidateId;
            data['employeeId'] = _body.employeeId;
            promises.push(client.query(queryService.insertCandidateEducationQuery(data)));
          });

          await Promise.all(promises);

          promises = [];
          extractedData['certifications'].map((data) => {
            data['candidateId'] = candidateId;
            data['employeeId'] = _body.employeeId;
            promises.push(client.query(queryService.insertCandidateAwardQuery(data)));
          });

          await Promise.all(promises);

          promises = [];
          extractedData['publications'].map((data) => {
            data['candidateId'] = candidateId;
            data['employeeId'] = _body.employeeId;
            promises.push(client.query(queryService.insertCandidatePublicationQuery(data)));
          });

          await Promise.all(promises);

          promises = [];
          extractedData['socialProfile'].map((data) => {
            data['candidateId'] = candidateId;
            data['employeeId'] = _body.employeeId;
            utils.stringEquals(data.title, 'github')
              ? (_body.githubId = data.link)
              : utils.stringEquals(data.title, 'Linkedin')
              ? (_body.linkedinId = data.link)
              : utils.stringEquals(data.title, 'Stackoverflow')
              ? (_body.stackoverflowId = data.link)
              : '';
          });
          _body.candidateId = candidateId;
          await client.query(queryService.insertCandidateSocialProfile(_body));
          await client.query(queryService.insertExtractedLanguagesQuery(extractedData));
          await client.query('COMMIT');

          return resolve({ code: 200, message: 'Candidate resume file updated successfully', data: candidateId });
        } catch (error) {
          console.log('error : ', error.message);
          reject(new Error({ code: 400, message: 'Error occured during extraction', data: error.message }.toString()));
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Function to update the candidate's profile details
export const modifyProfileDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        if (_body.userRoleId == 4) {
          await client.query(queryService.modifyFreelancerProfileDetailsQuery(_body));
        } else {
          _body.sellerCompanyId = _body.userRoleId == 1 ? _body.sellerCompanyId : _body.companyId;
          await client.query(queryService.modifyCandidateProfileDetailsQuery(_body));
        }
        resolve({ code: 200, message: 'Candidate ProfileDetails updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Update candidate availability
export const modifyCandidateAvailability = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query(queryService.modifyCandidateAvailabilityQuery(_body));
        resolve({ code: 200, message: 'Candidate availability updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Function to add or update a candidate's language proficiency.
// Checks if the action is add or update.
export const modifyLanguageProficiency = (_body) => {
  return new Promise((resolve, reject) => {
    let candidateLanguageId;
    let temp;
    (async () => {
      const client = await database().connect();
      _body.proficiency = utils.emptyStringCheck(_body.proficiency);
      try {
        switch (_body.action) {
          case 'add':
            temp = await client.query(queryService.insertLanguageProficiencyQuery(_body));
            candidateLanguageId = temp.rows[0].candidate_language_id;
            break;

          case 'update':
            if (utils.notNull(_body.candidateLanguageId)) {
              await client.query(queryService.modifyLanguageProficiencyQuery(_body));
              candidateLanguageId = _body.candidateLanguageId;
            }

            break;

          case 'delete':
            if (utils.notNull(_body.candidateLanguageId)) {
              await client.query(queryService.deleteLanguageProficiencyQuery(_body));
              candidateLanguageId = _body.candidateLanguageId;
            }
            break;

          default:
            reject(new Error({ code: 400, message: 'Invalid candidateLanguageId or action ', data: {} }.toString()));
        }
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate Language updated successfully', data: { candidateLanguageId: candidateLanguageId } });
      } catch (e) {
        console.log('error caught : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      console.log('error caught 2 : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Add work experience of the candidate
export const addWorkExperience = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        _body.remoteWorkExperience === '' ? null : _body.remoteWorkExperience;
        _body.currencyTypeId == null ? 1 : _body.currencyTypeId;
        _body.billingTypeId == null ? 2 : _body.billingTypeId;
        await client.query(queryService.addWorkExperiences(_body));
        resolve({ code: 200, message: 'Candidate overall work experience updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Insert,update or delete projects done by the candidate.
export const modifyCandidateProject = (_body) => {
  return new Promise((resolve, reject) => {
    let candidateProjectId;
    (async () => {
      const client = await database().connect();
      try {
        switch (_body.action) {
          case 'add':
            _body.skills = JSON.stringify(_body.skills);
            var results = await client.query(queryService.insertCandidateProjectsQuery(_body));
            candidateProjectId = results.rows[0].candidate_project_id;
            break;

          case 'update':
          case ![null, undefined, ''].includes(_body.candidateProjectId):
            _body.skills = JSON.stringify(_body.skills);
            await client.query(queryService.modifyCandidateProjectsQuery(_body));
            candidateProjectId = _body.candidateProjectId;
            break;

          case 'delete':
          case ![null, undefined, ''].includes(_body.candidateProjectId):
            await client.query(queryService.deleteCandidateProjectsQuery(_body));
            candidateProjectId = _body.candidateProjectId;
            break;

          default:
            reject(new Error({ code: 400, message: 'Invalid candidateProjectId or action ', data: {} }.toString()));
        }

        resolve({ code: 200, message: 'Candidate project updated successfully', data: { candidateProjectId: candidateProjectId } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Update candidate's work history
export const modifyCandidateWorkHistory = (_body) => {
  return new Promise((resolve, reject) => {
    let candidateWorExperienceId;
    (async () => {
      const client = await database().connect();
      _body.startDate = utils.emptyStringCheck(_body.startDate);
      _body.endDate = utils.emptyStringCheck(_body.endDate);

      try {
        switch (_body.action) {
          case 'add':
            var results = await client.query(queryService.insertCandidateWorkHistoryQuery(_body));
            candidateWorExperienceId = results.rows[0].candidate_work_experience_id;
            break;

          case 'update':
          case ![null, undefined, ''].includes(_body.candidateWorkExperienceId):
            await client.query(queryService.modifyCandidateWorkHistoryQuery(_body));
            candidateWorExperienceId = _body.candidateWorkExperienceId;
            break;

          case 'delete':
          case ![null, undefined, ''].includes(_body.candidateWorkExperienceId):
            await client.query(queryService.deleteCandidateWorkHistoryQuery(_body));
            candidateWorExperienceId = _body.candidateWorkExperienceId;
            break;

          default:
            reject(new Error({ code: 400, message: 'Invalid candidateWorkExperienceId or action ', data: {} }.toString()));
        }
        resolve({ code: 200, message: 'Candidate work history updated successfully', data: { candidateWorExperienceId: candidateWorExperienceId } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      console.log(e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Insert,update or delete educational qualifications of candidate
export const modifyEducation = (_body) => {
  return new Promise((resolve, reject) => {
    let candidateEducationId;
    (async () => {
      const client = await database().connect();
      try {
        switch (_body.action) {
          case 'add':
            var results = await client.query(queryService.insertCandidateEducationQuery(_body));
            candidateEducationId = results.rows[0].candidate_education_id;
            break;

          case 'update':
          case ![null, undefined, ''].includes(_body.candidateEducationId):
            await client.query(queryService.modifyCandidateEducationQuery(_body));
            candidateEducationId = _body.candidateEducationId;
            break;

          case 'delete':
          case ![null, undefined, ''].includes(_body.candidateEducationId):
            await client.query(queryService.deleteCandidateEducationQuery(_body));
            candidateEducationId = _body.candidateEducationId;
            break;

          default:
            reject({ code: 400, message: 'Invalid candidateEducationId or action ', data: {} });
        }

        resolve({ code: 200, message: 'Candidate education updated successfully', data: { candidateEducationId: candidateEducationId } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Update cloud proficiencies acheived by the candidate
export const modifyCloudProficiency = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        _body.idSet = Array.isArray(_body.cloudProficiency) ? _body.cloudProficiency.map((a) => a.cloudProficiencyId).filter(Number) : false;
        if (_body.idSet) {
          await client.query(queryService.deleteCandidateCloudQuery(_body));
          await client.query(queryService.insertCandidateCloudQuery(_body));
        }

        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate cloud proficiency updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Update social media links of the candidate
export const modifySocialPresence = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query(queryService.insertCandidateSocialQuery(_body));

        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate social profile updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Update any publications done by the candidate
export const modifyPublication = (_body) => {
  return new Promise((resolve, reject) => {
    let candidatePublicationId;
    (async () => {
      const client = await database().connect();
      _body.publishedYear = utils.emptyStringCheck(_body.publishedYear);
      try {
        switch (_body.action) {
          case 'add':
            var results = await client.query(queryService.insertCandidatePublicationQuery(_body));
            candidatePublicationId = results.rows[0].candidate_publication_id;
            break;

          case 'update':
          case ![null, undefined, ''].includes(_body.candidatePublicationId):
            await client.query(queryService.modifyCandidatePublicationQuery(_body));
            candidatePublicationId = _body.candidatePublicationId;
            break;

          case 'delete':
          case ![null, undefined, ''].includes(_body.candidatePublicationId):
            await client.query(queryService.deleteCandidatePublicationQuery(_body));
            candidatePublicationId = _body.candidatePublicationId;
            break;

          default:
            reject({ code: 400, message: 'Invalid candidatePublicationId or action ', data: {} });
        }
        resolve({ code: 200, message: 'Candidate Publication updated successfully', data: { candidatePublicationId: candidatePublicationId } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      } finally {
        client.release();
      }
    })().catch(() => {
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Update any awards acheived by the candidate
export const modifyAward = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      _body.certifiedYear = utils.emptyStringCheck(_body.certifiedYear);
      try {
        switch (_body.action) {
          case 'add':
            await client.query(queryService.insertCandidateAwardQuery(_body));
            break;

          case 'update':
          case ![null, undefined, ''].includes(_body.candidateAwardId):
            await client.query(queryService.modifyCandidateAwardQuery(_body));
            break;

          case 'delete':
          case ![null, undefined, ''].includes(_body.candidateAwardId):
            await client.query(queryService.deleteCandidateAwardQuery(_body));
            break;

          default:
            reject({ code: 400, message: 'Invalid candidateAwardId or action ', data: {} });
        }

        resolve({ code: 200, message: 'Candidate Award updated successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      } finally {
        client.release();
      }
    })().catch((e) => {
      console.log('E', e);
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Update any skills of candidate
export const modifySkill = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        switch (_body.action) {
          case 'add':
            _body.skillId = ![null, undefined, ''].includes(_body.skill) ? _body.skill.skillId : null;
            await client.query(queryService.insertCandidateSkillQuery(_body));
            break;

          case 'update':
          case ![null, undefined, ''].includes(_body.candidateSkillId):
            _body.skillId = ![null, undefined, ''].includes(_body.skill) ? _body.skill.skillId : null;
            await client.query(queryService.modifyCandidateSkillQuery(_body));
            break;

          case 'delete':
          case ![null, undefined, ''].includes(_body.candidateSkillId):
            _body.skillId = ![null, undefined, ''].includes(_body.skill) ? _body.skill.skillId : null;
            await client.query(queryService.deleteCandidateSkillQuery(_body));
            break;

          default:
            reject({ code: 400, message: 'Invalid candidateSkillId or action ', data: {} });
        }
        resolve({ code: 200, message: 'Candidate Skill updated successfully', data: {} });
      } catch (e) {
        console.log('Error 1 : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.log('Error 2 : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Fetch resume details about the candidate.  ( Resume Page)
export const getResume = (_body) => {
  return new Promise((resolve, reject) => {
    const candidateId = _body.candidateId;
    const projectArray = [];
    const assesmentArray = [];

    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        const allProfileDetails = await client.query(queryService.fetchProfile(candidateId));
        const skills = await client.query(queryService.fetchSkills(candidateId));
        const projects = await client.query(queryService.fetchProjects(candidateId));
        const workExperiences = await client.query(queryService.fetchWorkExperience(candidateId));
        const educations = await client.query(queryService.fetchEducations(candidateId));
        const socialProfileDetails = await client.query(queryService.fetchSocialProfile(candidateId));
        const cloudProficiencyDetails = await client.query(queryService.fetchCloudProficiency(candidateId));
        const publications = await client.query(queryService.fetchPublications(candidateId));
        const awards = await client.query(queryService.fetchAwards(candidateId));
        const languages = await client.query(queryService.fetchLanguages(candidateId));
        const designations = await client.query(queryService.fetchDesignations());

        let workedCompanyList = workExperiences.rows.map((element) => ({ id: element.candidateWorkExperienceId, companyName: element.companyName }));
        workedCompanyList = [...workedCompanyList, { id: 0, companyName: 'Freelancing' }];
        let companyJson = {};
        companyJson = Object.assign({ 0: 'On personal capacity' }, companyJson);
        workExperiences.rows.forEach((element) => {
          companyJson[element.candidateWorkExperienceId] = element.companyName;
        });

        if (Array.isArray(projects.rows)) {
          projects.rows.forEach((element) => {
            projectArray.push({
              candidateProjectId: element.candidateProjectId,
              candidateId: element.candidateId,
              projectName: element.projectName,
              clientName: element.clientName,
              yearsOfExperience: element.yoe,
              projectDescription: element.projectDescription,
              projectLink: element.projectLink,
              contribution: element.contribution,
              doneFor: element.doneFor,
              doneForName: companyJson[element.doneFor],
              role: element.role,
              skills: JSON.parse(element.skills),
              extraProject: element.extraProject,
            });
          });
        }

        const citizenship = allProfileDetails.rows[0].citizenship;
        const citizenshipName = ![null, undefined, ''].includes(citizenship) ? config.countries.filter((element) => element.id == citizenship)[0].name : '';
        const residence = allProfileDetails.rows[0].residence;

        const profileDetails = {
          firstName: allProfileDetails.rows[0].firstName,
          lastName: allProfileDetails.rows[0].lastName,
          candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
          jobCategoryId: allProfileDetails.rows[0].jobCategoryId,
          jobCategoryName: allProfileDetails.rows[0].jobCategoryName,
          description: allProfileDetails.rows[0].description,
          candidateStatus: allProfileDetails.rows[0].candidateStatus,
          sellerCompanyId: allProfileDetails.rows[0].sellerCompanyId,
          image: allProfileDetails.rows[0].image,
          citizenship,
          citizenshipName,
          residence,
          phoneNumber: allProfileDetails.rows[0].phoneNumber,
          timezone: allProfileDetails.rows[0].timezone,
          email: allProfileDetails.rows[0].email,
          candidateVetted: allProfileDetails.rows[0].candidateVetted,
          blacklisted: allProfileDetails.rows[0].blacklisted,
        };

        const overallWorkExperience = {
          cost: allProfileDetails.rows[0].rate,
          ellowRate: allProfileDetails.rows[0].ellowRate,
          workExperience: allProfileDetails.rows[0].workExperience,
          remoteWorkExperience: allProfileDetails.rows[0].remoteWorkExperience,
          billingTypeId: allProfileDetails.rows[0].billingTypeId,
          currencyTypeId: allProfileDetails.rows[0].currencyTypeId,
          candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
        };
        const availability = {
          availability: allProfileDetails.rows[0].availability,
          typeOfAvailability: allProfileDetails.rows[0].typeOfAvailability,
          readyToStart: allProfileDetails.rows[0].readyToStart,
          timeOfAvailability: allProfileDetails.rows[0].timeOfAvailability,
        };

        // let tempD = {"dstOffset":0,"rawOffset":19800,"status":"OK","timeZoneId":"Asia/Kolkata","timeZoneName":"India Standard Time"}
        _body.resData = {
          candidateId: Number(_body.candidateId),
          companyType: allProfileDetails.rows[0].companyType,
          profile: profileDetails,
          requestForScreening: allProfileDetails.rows[0].requestForScreening,
          detailResume: utils.jsonStringParse(allProfileDetails.rows[0].detailResume),
          htmlResume: allProfileDetails.rows[0].htmlResume,
          bagOfWords: allProfileDetails.rows[0].bagOfWords,
          resume: allProfileDetails.rows[0].resume,
          overallWorkExperience,
          availability,
          socialPresence: socialProfileDetails.rows[0],
          candidateCloudProficiency: cloudProficiencyDetails.rows,
          skills: skills.rows,
          projects: projectArray,
          assesments: assesmentArray,
          workExperience: workExperiences.rows,
          education: educations.rows,
          publications: publications.rows,
          awards: awards.rows,
          languages: languages.rows,
          workedCompanyList,
          designationList: designations.rows[0].designations,
          gmtOffset: utils.extractGmt(profileDetails.timezone),
        };
        const checkFreechelancerPasswordSent = await client.query(queryService.checkLoginSent(candidateId));
        if (checkFreechelancerPasswordSent.rowCount == 1) {
          if (profileDetails.firstName == null && profileDetails.lastName == null && profileDetails.email == null) {
            _body.resData['isLoginSent'] = true;
          } else {
            _body.resData['isLoginSent'] = allProfileDetails.rows[0].isLoginSent;
          }
        }
        await client.query('COMMIT');
        resolve({
          code: 200,
          message: 'Resume listed successfully',
          data: _body.resData,
        });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Update resume share link
export const addResumeShareLink = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        if (!isNaN(_body.candidateId)) {
          _body.uniqueId = nanoid();
          const sharedEmails = [];
          let domain = '';
          let flag = 0;
          let filteredEmails = [];
          const domainResult = await client.query(queryService.getDomainFromEmployeeId(_body));
          domain = domainResult.rows[0].domain;
          if (_body.userRoleId == 1) {
            filteredEmails = _body.sharedEmails;
          } else {
            filteredEmails = _body.sharedEmails.filter((element) => element.endsWith('@' + domain));
            _body.sharedEmails.length != filteredEmails.length ? (flag = 1) : '';
          }

          _body.sharedEmails = filteredEmails;
          const result = await client.query(queryService.addResumeShare(_body));
          const results = await client.query(queryService.getNames(_body));

          if (utils.notNull(result.rows) && result.rows.length > 0) {
            _body.uniqueId = result.rows[0].unique_key;
            _body.firstname = results.rows[0].firstname;
            _body.lastname = results.rows[0].lastname;

            await emailService.addResumeShareLinkEmail(_body);
          }
          if (flag == 0) {
            resolve({ code: 200, message: 'Resume link shared successfully', data: sharedEmails });
          } else {
            reject({ code: 201, message: 'The entered email does not belong to your company domain', data: 'Unauthorised domain access' });
          }
        } else {
          reject({ code: 400, message: 'Invalid candidateId', data: {} });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Fetch shared emails for resume
export const getSharedEmails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        if (!isNaN(_body.candidateId)) {
          const result = await client.query(queryService.getSharedEmails(_body));
          const sharedEmails = [undefined, null].includes(result.rows[0]) ? [] : result.rows[0].sharedEmails;
          resolve({ code: 200, message: 'Candidate shared emails retrieved', data: sharedEmails });
        } else {
          reject({ code: 400, message: 'Invalid candidateId', data: {} });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Signup from a shared resume page
export const shareResumeSignup = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        const result = await client.query(queryService.getSharedEmailsWithToken(_body));

        if (result.rows[0]['sharedEmails'].includes(_body.email)) {
          const emailCheck = await client.query(queryService.getEmail(_body));
          if (emailCheck.rowCount == 0) {
            _body.updatedBy = result.rows[0].updatedBy;
            const getcompanyId = await client.query(queryService.getCompanyIdFromEmployeeId(_body));
            _body.cmpId = getcompanyId.rows[0].company_id;

            const password = passwordGenerator.generate({ length: 10, numbers: true });
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            _body.password = hashedPassword;
            await client.query(queryService.insertUserData(_body));

            await emailService.shareResumeSignupEmail(_body, client);

            await client.query('COMMIT');
            resolve({ code: 200, message: 'Employee Added Successfully', data: {} });
          } else {
            reject({ code: 400, message: 'User already registered.Please use signin to continue', data: {} });
          }
        } else {
          reject({ code: 400, message: 'You do not have sufficient permissions to access this resume', data: {} });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Get the details in a candidate's resume
export const fetchResumeData = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        const result = await client.query(queryService.getCandidateId(_body));
        if (result.rows[0]) {
          const emailResult = await client.query(queryService.getEmailFromEmployeeId(_body));

          if (result.rows[0].shared_emails.includes(emailResult.rows[0].email)) {
            const candidateId = result.rows[0].candidate_id;
            _body.candidateId = candidateId;
            const data = await getResume(_body);
            delete data['data'].assesmentLink;
            delete data['data'].assesementComment;
            delete data['data'].assesments;

            resolve({ code: 200, message: 'Candidate resume listed successfully', data: data['data'] });
          } else {
            reject({ code: 400, message: 'You do not have access to this content', data: {} });
          }
        } else {
          reject({ code: 400, message: 'Token expired or does not exist', data: {} });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Get initial details of a candidate's resume
export const initialSharedResumeData = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        const result = await client.query(queryService.getCandidateId(_body));
        if (result.rows[0]) {
          const candidateId = result.rows[0].candidate_id;
          _body.candidateId = candidateId;

          const allProfileDetails = await client.query(queryService.fetchProfile(candidateId));
          const skills = await client.query(queryService.fetchSkills(candidateId));
          const sharedEmailSet = await client.query(queryService.fetchSharedResumeLinkEmails(candidateId));
          const citizenship = allProfileDetails.rows[0].citizenship;
          const citizenshipName = ![null, undefined, ''].includes(citizenship) ? config.countries.filter((element) => element.id == citizenship)[0].name : '';
          const residence = allProfileDetails.rows[0].residence;

          const profileDetails = {
            firstName: allProfileDetails.rows[0].firstName,
            lastName: allProfileDetails.rows[0].lastName,
            candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
            description: allProfileDetails.rows[0].description,
            candidateStatus: allProfileDetails.rows[0].candidateStatus,
            sellerCompanyId: allProfileDetails.rows[0].sellerCompanyId,
            image: allProfileDetails.rows[0].image,
            citizenship,
            citizenshipName,
            residence,
            phoneNumber: allProfileDetails.rows[0].phoneNumber,
            email: allProfileDetails.rows[0].email,
            candidateVetted: allProfileDetails.rows[0].candidateVetted,
          };

          const overallWorkExperience = {
            cost: allProfileDetails.rows[0].rate,
            ellowRate: allProfileDetails.rows[0].ellowRate,
            workExperience: allProfileDetails.rows[0].workExperience,
            remoteWorkExperience: allProfileDetails.rows[0].remoteWorkExperience,
            billingTypeId: allProfileDetails.rows[0].billingTypeId,
            currencyTypeId: allProfileDetails.rows[0].currencyTypeId,
            candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
          };
          const availability = {
            availability: allProfileDetails.rows[0].availability,
            typeOfAvailability: allProfileDetails.rows[0].typeOfAvailability,
            readyToStart: allProfileDetails.rows[0].readyToStart,
          };
          _body.resData = {
            candidateId: Number(_body.candidateId),
            profile: profileDetails,
            resume: allProfileDetails.rows[0].resume,
            overallWorkExperience,
            availability,
            skills: skills.rows,
          };
          if (sharedEmailSet.rowCount > 0) _body.resData['sharedResume'] = sharedEmailSet.rows[0].shared_emails;
          await client.query('COMMIT');
          resolve({
            code: 200,
            message: 'Initial Resume data listed successfully',
            data: _body.resData,
          });
        } else {
          reject({ code: 400, message: 'Token expired or does not exist', data: {} });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// create pdf
export const createPdfFromHtml = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const candidateId = _body.candidateId;
        _body.sharedEmails = _body.sharedEmails.filter((elements) => elements != null);
        const pdf = await builder.pdfBuilder(candidateId, _body.host);
        await client.query(queryService.saveSharedEmailsForpdf(_body));

        emailService.createPdfFromHtmlEmail(_body, pdf);
        await client.query('COMMIT');

        resolve({ code: 200, message: 'Resume in PDF format has been shared successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// fetch data for pdf share
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Get the details in a candidate's resume
export const fetchResumeDataForPdf = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        if (builder.getCache().has(_body.uniqueId)) {
          const candidateId = builder.getCache().take(_body.uniqueId);
          _body.candidateId = candidateId;
          const data = await getResume(_body);
          delete data['data'].assesmentLink;
          delete data['data'].assesementComment;
          delete data['data'].assesments;

          resolve({ code: 200, message: 'Candidate resume shared data fetched successfully', data: data['data'] });
        } else {
          console.log('uniqueId does not exist');

          reject({ code: 400, message: 'UniqueId expired or does not exist', data: {} });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// fetch data for pdf share
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Get the details in a candidate's resume
export const fetchSharedEmailsForPdf = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        const sharedEmails = await client.query(queryService.getSharedEmailsPdf(_body));
        const reqdEmails = ![undefined, null].includes(sharedEmails.rows[0]) ? sharedEmails.rows[0].sharedemails : [];
        resolve({ code: 200, message: 'Shared emails listed successfully', data: reqdEmails });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// fetch data for pdf share
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Get the details in a candidate's resume
export const getCandidateAssesmentDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const query1 = await client.query(queryService.getAssesmentDetails(_body));
        const query2 = await client.query(queryService.getAllocatedVettedStatus(_body));
        const query3 = await client.query(queryService.getEllowAdmins());
        const reviews = query1.rows;
        const candidateVetted = query2.rows[0].candidate_vetted;
        const currentEllowStage = query2.rows[0].current_ellow_stage;
        const allocatedTo = query2.rows[0].allocated_to;
        const admins = query3.rows;
        resolve({ code: 200, message: 'Assessment details listed successfully', data: { reviews, candidateVetted, currentEllowStage, allocatedTo, admins } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.log(e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// Change assignee of a particular candidate
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> set assignee id to a candidate table
export const changeAssignee = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const result = await client.query(queryService.changeCandidateAssignee(_body));
        await emailService.changeAssigneeEmail(_body, client);

        resolve({ code: 200, message: 'Assignee changed successfully', data: result.rows });
      } catch (e) {
        console.log('error : ', e.message);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// Change stage of ellow recuitment
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> set corresponding stage values and flags in candidate related db
export const changeEllowRecruitmentStage = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        if ([undefined, null, ''].includes(_body.assignedTo)) {
          reject({ code: 400, message: 'Candidate must be assigned to an assignee', data: {} });
        } else {
          await client.query(queryService.changeEllowRecruitmentStage(_body));
          await client.query(queryService.updateEllowStageStatus(_body));
          await emailService.changeEllowRecruitmentStageEmail(_body, client);
          let results = await client.query(queryService.getCandidatesProfile(_body));
          let data = results.rows[0];
          (_body.firstName = data.candidate_first_name), (_body.lastName = data.candidate_last_name), (_body.email = data.email_address), (_body.telephoneNumber = data.phone_number);
          if (_body.stageName == config.ellowRecruitmentStatus.TechnicalAssessmentStage) {
            _body.stepId = 6;
            let stageStatusResult = await client.query(queryService.getStageStatus(_body));
            if (stageStatusResult.rows[0].stage_status == null) {
              _body.listId = config.sendinblue.fullProfileList;
              sendinblueService.sendinblueAddResources(_body);
            }
          }
          if (_body.stageName == config.ellowRecruitmentStatus.vettedStage) {
            _body.listId = config.sendinblue.certifiedListId;
            sendinblueService.sendinblueAddResources(_body);
          }
          await client.query('COMMIT');
          resolve({ code: 200, message: 'Moved to stage successfully', data: {} });
        }
      } catch (e) {
        console.log('error : ', e.message);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// Reject at a stage of ellow recruitment
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> set corresponding stage values and flags in candidate_assesment and candidate db
export const rejectFromCandidateEllowRecruitment = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        if (utils.notNull(_body.assignedTo)) {
          await client.query(queryService.rejectFromCandidateEllowRecruitment(_body));
          await emailService.rejectFromCandidateEllowRecruitmentEmail(_body, client);
          resolve({ code: 200, message: 'Rejected candiate successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Candidate must be assigned to an assignee', data: {} });
        }
      } catch (e) {
        console.log('error : ', e.message);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Get logs of hiring steps from the database
export const getAllAuditLogs = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const results = await client.query(queryService.getAuditLogs(_body));
        resolve({ code: 200, message: 'Rejected candiate successfully', data: { logs: results.rows } });
      } catch (e) {
        console.log('error : ', e.message);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>Listing all the free candidates from the candidates list of hirer.
export const listHirerResources = (_body) => {
  return new Promise((resolve, reject) => {
    const selectQuery = candidateQuery.listFreeCandidatesOfHirerFromView;
    const totalQuery = candidateQuery.listFreeCandidatesofHirerTotalCount;
    let queryText = '';
    let searchQuery = '';
    let queryValues = {};
    let filterQuery = '';
    const filter = _body.body != undefined ? _body.body.filter : '';
    const body = _body.query;

    // Search for filters in the body
    const filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
    filterQuery = filterResult.filterQuery;
    queryValues = filterResult.queryValues;

    // Search for company name / candidate name
    const searchResult = utils.resourceSearch(body, queryValues);
    searchQuery = searchResult.searchQuery;
    queryValues = searchResult.queryValues;

    (async () => {
      const client = await database();
      try {
        queryText = selectQuery + utils.resourceHirerTab(body) + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
        console.log(queryText);
        const queryCountText = totalQuery + utils.resourceHirerTab(body) + filterQuery + searchQuery;
        queryValues = Object.assign({ hirercompanyid: Number(_body.body.companyId) }, queryValues);
        console.log(queryCountText)
        const candidatesResult = await client.query(queryService.listCandidatesOfHirer(queryText, queryValues));
        const totalCount = await client.query(queryService.listCandidatesOfHirerCount(queryCountText, queryValues));
        resolve({ code: 200, message: 'Candidate Listed successfully', data: { candidates: candidatesResult.rows, totalCount: totalCount.rows[0].totalCount } });
      } catch (e) {
        console.log('error : ', e.message);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// Change availability of a candidate
export const changeAvailability = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query(queryService.changeAvailabilityOfCandidate(_body));
        const candidateDetails = await client.query(queryService.getCandidateMailDetails(_body));
        const skillSets = await client.query(queryService.getCandidateSkillSet(_body));
        _body.coreSkills = skillSets.rows[0].skills;
        _body.firstName = utils.capitalize(candidateDetails.rows[0].candidate_first_name);
        _body.lastName = utils.capitalize(candidateDetails.rows[0].candidate_last_name);
        _body.phoneNumber = candidateDetails.rows[0].phone_number;
        _body.candidateName = utils.capitalize(candidateDetails.rows[0].candidate_first_name) + ' ' + utils.capitalize(candidateDetails.rows[0].candidate_last_name);
        _body.candidateEmail = candidateDetails.rows[0].email_address;
        _body.candidatePositionName = candidateDetails.rows[0].candidate_position_name;
        await emailService.updateAvailabilityNotificationMails(_body, client);
        const toastMessage = _body.availability == true ? 'Availability turned ON successfully' : 'Availability turned OFF successfully';
        await client.query('COMMIT');
        resolve({ code: 200, message: toastMessage, data: {} });
      } catch (e) {
        console.log('error : ', e.message);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// blacklist or revert blacklist candidate
export const changeBlacklisted = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query(queryService.changeBlacklistedOfCandidate(_body));
        await emailService.changeBlacklistedEmail(_body, client);
        resolve({ code: 200, message: 'Blacklisted toggled successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// Extract resume data and parse content from response
export const resumeParser = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        var resumeCheck = await client.query(queryService.checkResumeExistance(_body));
        if (resumeCheck.rowCount == 0) {
          let responseData = null;

          const jsonObject = JSON.stringify({
            url: _body.publicUrl + encodeURIComponent(_body.fileName),
            userkey: 'IC8Q6BQ5',
            version: '8.0.0',
            subuserid: 'Deena Sasidhar',
          });

          // prepare the header
          const postheaders = {
            'Content-Type': 'application/json',
            // eslint-disable-next-line no-undef
            'Content-Length': Buffer.byteLength(jsonObject, 'utf8'),
          };

          // the post options
          const optionspost = {
            host: 'rest.rchilli.com',
            port: 80,
            path: '/RChilliParser/Rchilli/parseResume',
            method: 'POST',
            headers: postheaders,
          };

          console.info('Options prepared:');
          console.info(optionspost);
          console.info('Do the POST call');

          // do the POST call
          const reqPost = https
            .request(optionspost, function (res) {
              // uncomment it for header details
              //  console.log("headers: ", res.headers);
              let data = '';
              res.on('data', function (d) {
                console.info('POST result:\n');
                data += d;
                console.info('\n\nPOST completed');
              });

              res.on('end', async () => {
                // process.stdout.write(data);
                responseData = JSON.parse(data);
                if (responseData['error'] !== undefined) {
                  reject({ code: 400, message: 'Failed Please try again, parser error ', data: responseData['error'] });
                } else {
                  responseData['employeeId'] = _body.employeeId;
                  responseData['resume'] = _body.fileName;
                  responseData['candidateId'] = _body.candidateId;
                  responseData['userRoleId'] = _body.userRoleId;
                  responseData['companyId'] = _body.companyId;
                  responseData['ResumeParserData']['ResumeFileName'] = _body.fileName.substring(36);

                  const resp = await modifyResumeData(responseData).catch((e) => {
                    console.log('error data received : ', e);

                    reject({ code: 400, message: 'Failed Please try again, parser error ', data: e.data });
                  });
                  resolve({ code: 200, message: 'Resume parsed successfully', data: { candidateId: resp['data'] } });
                }
              });
            })
            .on('error', (err) => {
              console.log('Error: ', err.message);
              reject({ code: 400, message: 'Error from parser', data: err.message });
            });
          // write the json data
          reqPost.write(jsonObject);
          reqPost.end();
          reqPost.on('error', function (e) {
            responseData = e.message;
          });
        } else {
          reject({ code: 400, message: 'The profile which you try to upload already exists with the platform', data: {} });
        }
      } catch (e) {
        console.log(e);
        reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>>>Function to edit the vetting status of the candidate.
export const singleSignOn = (_body) => {
  return new Promise((resolve, reject) => {
    let employeeId;
    let candidateId;
    (async () => {
      const client = await database();
      try {
        const tokenResponse = await fetch(
          'https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=https%3A%2F%2Fcandidate.ellow.io%2Fapi%2Fv1%2Fcandidates%2FsingleSignOn&client_id=867umqszmeupfh&client_secret=n7oVJe6kbinpdPqu&code=' +
            _body.code,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ a: 1, b: 'Textual content' }),
          },
        );
        const content = await tokenResponse.json();
        const accessToken = content.access_token;

        const profile = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
          method: 'GET',
          headers: {
            Host: 'api.linkedin.com',
            Connection: 'Keep-Alive',
            Authorization: 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        });
        const profileResult = await profile.json();
        _body.firstName = profileResult['firstName']['localized']['en_US'];
        _body.lastName = profileResult['lastName']['localized']['en_US'];
        const emailAddress = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
          method: 'GET',
          headers: {
            Host: 'api.linkedin.com',
            Connection: 'Keep-Alive',
            Authorization: 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        });
        const emailAddressResult = await emailAddress.json();
        _body.email = emailAddressResult.elements[0]['handle~']['emailAddress'];
        console.log(_body.email);
        var results = await client.query(queryService.loginMailCheck(_body));
        _body.companyName = 'Freelancer';
        const companyResults = await client.query(queryService.getCompanyDetailsFromName(_body));
        _body.cmpId = companyResults.rows[0].company_id;
        _body.userRoleId = 4;
        if (results.rowCount == 0) {
          const employeeResult = await client.query(queryService.insertLinkedinToEmployee(_body));
          employeeId = employeeResult.rows[0].employee_id;
          const candidateResult = await client.query(queryService.insertIntoCandidate(_body));
          candidateId = candidateResult.rows[0].candidate_id;
          _body.employeeId = employeeId;
          _body.candidateId = candidateId;
          await client.query(queryService.insertInToCandidateEmployee(_body));
          _body.token = jwt.sign(
            {
              employeeId: employeeId.toString(),
              companyId: _body.cmpId.toString(),
              userRoleId: _body.userRoleId.toString(),
              // eslint-disable-next-line no-undef
            },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' },
          );
          await client.query(queryService.insertEmployeeToken(_body));
        } else {
          employeeId = results.rows[0].employee_id;
          _body.employeeId = employeeId;
          if (results.rows[0].password == null && results.rows[0].linkedin_token !== null) {
            const getQuery = {
              name: 'get-employee-details',
              text: candidateQuery.getLoginDetailFromEmployeeId,
              values: [_body.employeeId],
            };
            var result = await client.query(getQuery);
            const data = result.rows;
            if (data.length > 0) {
              const value = data[0];
              if (value.status) {
                _body.token = value.linkedinToken;
              } else {
                reject({ code: 400, message: 'User does not exist.', data: {} });
              }
            }
          } else {
            reject({ code: 400, message: 'User already registered.Please login with your email and password provided!', data: {} });
          }
        }
        await client.query('COMMIT');
        // console.log("emailAddressResult : ",JSON.stringify(emailAddressResult));
        resolve({ code: 200, message: 'Candidate SSO successfull', data: { token: _body.token } });
      } catch (e) {
        await client.query('ROLLBACK');
        console.log(e);
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      }
    })().catch(() => {
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

export const getLinkedinEmployeeLoginDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');

        // Inserting the integer representing the vetting status value
        _body.tokens = _body.hasOwnProperty('token') ? _body.token : _body.googleToken.slice(0, -1);
        _body.query = _body.hasOwnProperty('token') ? candidateQuery.getDetailsUsingLinkedinToken : candidateQuery.getDetailsUsingGoogleToken;
        const getQuery = {
          name: 'get-employee-details',
          text: _body.query,
          values: [_body.tokens],
        };
        const results = await client.query(getQuery);
        const data = results.rows;
        if (data.length > 0) {
          const value = data[0];
          if (value.status) {
            resolve({
              code: 200,
              message: 'Login successful',
              data: {
                token: `Bearer ${_body.tokens}`,
                companyName: value.companyName,
                companyLogo: value.companyLogo,
                candidateId: value.candidateId,
                candidateStatus: value.candidateStatus,
                email: value.email,
                firstName: value.firstName,
                lastName: value.lastName,
                accountType: value.accountType,
                masked: value.masked,
                currencyTypeId: value.currencyTypeId,
                companyProfile: value.companyProfile,
                userRoleId: value.userRoleId,
              },
            });
          } else {
            reject({ code: 400, message: 'Employee does not exist.', data: {} });
          }
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      }
    })().catch(() => {
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>Listing all the free candidates from the candidates list of provider.
export const listProviderResources = (_body) => {
  return new Promise((resolve, reject) => {
    const selectQuery = candidateQuery.listFreeCandidatesOfProviderFromView;
    const totalQuery = candidateQuery.listFreeCandidatesofProviderTotalCount;
    let queryText = '';
    let searchQuery = '';
    let queryValues = {};
    let filterQuery = '';
    const filter = _body.body != undefined ? _body.body.filter : '';
    const body = _body.query;

    // Search for filters in the body
    const filterResult = utils.resourceFilter(filter, filterQuery, queryValues);
    filterQuery = filterResult.filterQuery;
    queryValues = filterResult.queryValues;

    // Search for company name / candidate name
    const searchResult = utils.resourceSearch(body, queryValues);
    searchQuery = searchResult.searchQuery;
    queryValues = searchResult.queryValues;

    (async () => {
      const client = await database();
      try {
        queryText = selectQuery + utils.resourceProviderTab(body) + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
        const queryCountText = totalQuery + utils.resourceProviderTab(body) + filterQuery + searchQuery;
        queryValues = Object.assign({ providerCompanyId: _body.body.companyId }, queryValues);
        console.log(queryText)
        const candidatesResult = await client.query(queryService.listCandidatesOfProvider(queryText, queryValues));
        const totalCount = await client.query(queryService.listCandidatesOfProviderCount(queryCountText, queryValues));
        resolve({ code: 200, message: 'Candidate Listed successfully', data: { candidates: candidatesResult.rows, totalCount: totalCount.rows[0].totalCount } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const getHtmlResume = (req, res) => {
  // eslint-disable-next-line no-undef
  const fs = require('fs');

  const inputFile = req.files.htmlres.data;
  const filename = req.files.htmlres.name.split('.').slice(0, -1).join('.');

  const temp = './sample.html';
  const outputFile = `./${filename}.docx`;

  fs.writeFile(temp, inputFile, function (err) {
    if (err) throw err;

    fs.readFile(temp, 'utf-8', function (err, html) {
      if (err) throw err;

      const docx = HtmlDocx.asBlob(html);
      fs.writeFile(outputFile, docx, function (err) {
        if (err) throw err;
        res.download(outputFile);
      });
    });
  });
};

export const updateProviderCandidateInfo = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        if (_body.decisionValue == 1) {
          _body.candidateStatus = 4;
        } else {
          _body.candidateStatus = 9;
          const names = await client.query(queryService.getCandidateProfileName(_body));
          const message = `${names.rows[0].company}  has submitted a candidate named ${names.rows[0].name} for approval`;
          createProviderNotifications({
            companyId: _body.companyId,
            message: message,
            candidateId: _body.candidateId,
            notificationType: 'candidate',
            userRoleId: _body.userRoleId,
            employeeId: _body.employeeId,
            image: null,
            firstName: names.rows[0].firstname,
            lastName: names.rows[0].lastname,
          });
        }
        await client.query(queryService.updateProviderCandidateDetails(_body));
        await client.query(queryService.updateProviderCandidateAvailability(_body));
        await client.query(queryService.addProviderCandidateWorkExperience(_body));
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate informations updated successfully', data: {} });
      } catch (e) {
        console.log('Error raised from try : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.log('Error raised from async : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const getProviderCandidateResume = (_body) => {
  return new Promise((resolve, reject) => {
    const candidateId = _body.candidateId;

    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');

        const allProfileDetails = await client.query(queryService.fetchProviderCandidateProfile(candidateId));

        const profileDetails = {
          candidateId: Number(_body.candidateId),
          firstName: allProfileDetails.rows[0].firstName,
          lastName: allProfileDetails.rows[0].lastName,
          candidatePositionName: allProfileDetails.rows[0].candidatePositionName,
          jobCategoryId: allProfileDetails.rows[0].jobCategoryId,
          phoneNumber: allProfileDetails.rows[0].phoneNumber,
          email: allProfileDetails.rows[0].email,
          availability: allProfileDetails.rows[0].availability,
          typeOfAvailability: allProfileDetails.rows[0].typeOfAvailability,
          readyToStart: allProfileDetails.rows[0].readyToStart,
          resume: allProfileDetails.rows[0].resume,
          workExperience: allProfileDetails.rows[0].workExperience,
          currencyTypeId: allProfileDetails.rows[0].currencyTypeId,
          billingTypeId: allProfileDetails.rows[0].billingTypeId,
          cost: allProfileDetails.rows[0].rate,
          locationName: allProfileDetails.rows[0].residence,
        };
        await client.query('COMMIT');
        resolve({
          code: 200,
          message: 'Resume listed successfully',
          data: {
            candidate: profileDetails,
          },
        });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const approveProvidersCandidates = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query(queryService.updateCandidateStatus(_body));
        await client.query(queryService.addDefaultTraits(_body));
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate informations updated successfully', data: {} });
      } catch (e) {
        console.log('Error raised from try : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.log('Error raised from async : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>> Link the providers candidate to a particular position .
export const addProviderCandidateEllowRate = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');

        if (_body.userRoleId == '1') {
          console.log(_body);
          await client.query(queryService.updateProviderCandidateEllowRate(_body));
          await client.query('COMMIT');
          _body.candidates = [
            {
              adminComment: _body.adminComment,
              billingTypeId: _body.billingTypeId,
              candidateId: _body.candidateId,
              currencyTypeId: _body.currencyTypeId,
              ellowRate: _body.ellowRate,
              fileName: _body.fileName,
            },
          ];

          _body.addEllowRateOnly = true;

          await emailService.linkCandidateWithPositionEMail(_body, client);
          await client.query('COMMIT');
          resolve({ code: 200, message: 'ellow rate added successfully', data: {} });
        } else {
          reject({ code: 400, message: 'Unauthorized Access', data: {} });
        }
      } catch (e) {
        console.log('error : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.log('error : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const mailers = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        // const oauth2Client = new google.auth.OAuth2(
        //     process.env.GMAIL_OAUTH_CLIENT_ID,
        //     process.env.GMAIL_OAUTH_CLIENT_SECRET,
        //     process.env.GMAIL_OAUTH_REDIRECT_URL,
        // );

        // // Generate a url that asks permissions for Gmail scopes
        // const GMAIL_SCOPES = [
        //     'https://mail.google.com/',
        //     'https://www.googleapis.com/auth/gmail.modify',
        //     'https://www.googleapis.com/auth/gmail.compose',
        //     'https://www.googleapis.com/auth/gmail.send',
        // ];

        // const url = oauth2Client.generateAuthUrl({
        //     access_type: 'offline',
        //     scope: GMAIL_SCOPES,
        // });

        // console.info(`authUrl: ${url}`);
        // const code = '4%2F0AY0e-g6FEhMGKmvYw3wKbBs4fRONjXYpzGiW6Ik8UGQmnufgdY3Zo4eZi8XaUgDTg7uPXw';

        // const oauth2Client = new google.auth.OAuth2(
        //   process.env.GMAIL_OAUTH_CLIENT_ID,
        //   process.env.GMAIL_OAUTH_CLIENT_SECRET,
        //   process.env.GMAIL_OAUTH_REDIRECT_URL,
        // );

        // const getToken ()  => {
        //   const { tokens } =  oauth2Client.getToken(code);
        //   console.info(tokens);
        // };

        // getToken();
        const adminReplacements = {};

        const adminPath = 'src/emailTemplates/ind.html';
        const ellowAdmins = await client.query(queryService.getEllowAdmins());
        console.log(ellowAdmins);
        if (Array.isArray(ellowAdmins.rows)) {
          ellowAdmins.rows.forEach((element) => {
            if (utils.notNull(element.email)) {
              emailClient.emailManagerForNoReply(element.email, config.text.newUserAdminTextSubject, adminPath, adminReplacements);
            }
          });
          resolve({ code: 200, message: 'Mail Send', data: {} });
        }
      } catch (e) {
        console.log('Error raised from try : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.log('Error raised from async : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const getEmailTemplate = (req, res) => {
  // eslint-disable-next-line no-undef
  const fs = require('fs');
  const pass = req.body.pass;
  const isHtml = req.body.html;
  const file = req.body.file;

  if (isHtml) {
    console.log('header : ', req.body.Authorisation);

    if (builder.checkKey(req.body.Authorisation)) {
      fs.readFile(`./src/emailTemplates/${file}`, function (err, data2) {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data2);
        return res.end();
      });
    } else {
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.end('Unauthorised access');
    }
  } else {
    const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex');

    if (hashedPassword == config.templatePass) {
      fs.readFile('./src/public/Email.html', function (err, data) {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, {
          'Content-Type': 'text/html',
        });
        res.write(data);
        return res.end();
      });
    } else {
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.end('Wrong passkey');
    }
  }
};

export const setEmailTemplate = (req, res) => {
  // eslint-disable-next-line no-undef
  const fs = require('fs');
  const isJs = req.query.js;

  if (isJs) {
    const token = builder.tempToken(req);

    fs.readFile('./src/public/start.js', function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/javascript' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
        Authorisation: token,
      });
      res.write(data);
      return res.end();
    });
  } else {
    fs.readFile('./src/public/passkey.html', function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
  }
};

// Share Applied candidates from positions page
export const shareAppliedCandidates = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        _body.sharedEmails = _body.sharedEmails.filter((elements) => elements != null);
        await client.query(queryService.saveSharedEmailsForpdf(_body));
        emailService.shareAppliedCandidatesPdfEmails(_body, client);
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Resume in PDF format has been shared successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>> Link the providers candidate to a particular position .
export const requestForScreeningManager = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        const candidateDetails = await client.query(queryService.getCandidateMailDetails(_body));
        await client.query(queryService.updateRequestForScreening(_body));
        _body.firstName = utils.capitalize(candidateDetails.rows[0].candidate_first_name);
        _body.lastName = utils.capitalize(candidateDetails.rows[0].candidate_last_name);
        _body.candidateName = utils.capitalize(candidateDetails.rows[0].candidate_first_name) + ' ' + utils.capitalize(candidateDetails.rows[0].candidate_last_name);
        _body.candidateEmail = candidateDetails.rows[0].email_address;
        _body.candidatePositionName = candidateDetails.rows[0].candidate_position_name;
        await emailService.requestForScreeningMail(_body, client);
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Requested for ellow screening ', data: {} });
      } catch (e) {
        console.log('error : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.log('error : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Sent freelancer login credentials
export const sentFreelancerLoginCredentials = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        const companyCheckResults = await client.query(queryService.companyCheck(_body));
        const data = companyCheckResults.rows[0];
        _body.firstName = data.candidate_first_name;
        _body.lastName = data.candidate_last_name;
        _body.sellerCompanyId = data.company_id;
        _body.email = data.email_address;
        _body.phoneNumber = data.phone_number;
        if (_body.userRoleId == 1 && companyCheckResults.rows[0].company_type == 2) {
          const results = await client.query(queryService.verifyCandidateInCandidateEmployee(_body));
          if (results.rowCount == 0) {
            const password = passwordGenerator.generate({
              length: 10,
              numbers: true,
            });
            _body.hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            const employeeResult = await client.query(queryService.addEmployee(_body));
            _body.candidateEmployeeId = employeeResult.rows[0].employee_id;
            await client.query(queryService.addCandidateEmployee(_body));
            const userSubject = 'ellow.io  Login Credentials';
            const userPath = 'src/emailTemplates/freelancerAdminLoginText.html';
            const userCredentialReplacements = {
              name: _body.firstName,
              user: _body.email,
              password: password,
            };

            emailClient.emailManagerForNoReply(_body.email, userSubject, userPath, userCredentialReplacements);
          }
        }
        resolve({ code: 200, message: 'Password sent successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};

// Change stage of ellow recuitment
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> set corresponding stage values and flags in candidate related db
export const fileDownload = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const pdf = await builder.pdfBuilder(_body.candidateId, _body.host);
        // Or format the path using the `id` rest param
        resolve({ code: 200, message: 'DOWLOADED', data: { file: pdf } });
      } catch (e) {
        console.log('error : ', e.message);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// download pdf
export const downloadPdf = async (req, res) => {
  // return new Promise((resolve, reject) => {
  //     (async () => {
  //         const client = await database()
  //         try {
  //             var candidateId = _body.candidateId
  //             let pdf = await builder.pdfBuilder(candidateId, _body.host);
  //             await client.query('COMMIT')

  //             resolve({ code: 200, message: "Resume in PDF format has been shared successfully", data: {pdf:pdf} });

  //         } catch (e) {
  //             console.log(e)
  //             await client.query('ROLLBACK')
  //             reject({ code: 400, message: "Failed. Please try again.", data: e.message });
  //         }
  //     })().catch(e => {
  //         reject({ code: 400, message: "Failed. Please try again.", data: e.message })
  //     })
  // })
  const candidateId = req.body.candidateId;
  const pdf = await builder.pdfBuilder(candidateId, req.body.host);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=resume.Pdf');
  res.setHeader('Content-Length', pdf.length);
  return res.end(pdf);
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Approve or Reject applied candidate - Hirer functionality
export const approveOrRejectAppliedCandidate = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const getCandidateDetailsFromToken = await client.query(queryService.getCandidateDetailsFromTokenQueryService(_body));
        if (getCandidateDetailsFromToken.rowCount == 0) {
          (_body.responseMessage = `Cannot process the request since this action is already taken`), (_body.responseStatus = 3);
          console.log('Action Taken');
          resolve({ code: 200, message: _body.responseMessage, data: { status: _body.responseStatus } });
        } else {
          const results = getCandidateDetailsFromToken.rows[0];
          (_body.candidateId = results.candidate_id), (_body.positionId = results.position_id), (_body.assignedTo = _body.employeeId), (_body.candidateHiringStepName = 'Discussion with resource');
          (_body.candidateHiringStepOrder = 1), (_body.candidateName = results.name);
          const positions = await client.query(queryService.getPositionName(_body));
          _body.positionName = positions.rows[0].position_name;
          const assigneeDetails = await client.query(queryService.getAssigneeDetails(_body));
          (_body.assignedTo = assigneeDetails.rows[0].employee_id), (_body.assigneeName = assigneeDetails.rows[0].name);
          _body.companyName = positions.rows[0].company_name;
          _body.employeeId = _body.assignedTo;
          await client.query(queryService.updateDefaultAssigneeQuery(_body));
          if (_body.status == 1) {
            _body.auditLogComment = `${_body.assigneeName} (${_body.companyName}) has moved the candidate ${_body.candidateName} to ${_body.candidateHiringStepName} for the position ${_body.positionName}`;
            _body.assigneeComment = `${_body.assigneeName} has moved the candidate to ${_body.candidateHiringStepName}`;
            await client.query(queryService.updateCandidateHiringSteps(_body));
            await emailService.scheduleInterviewMail(_body, client);
          } else {
            _body.auditLogComment = `${_body.assigneeName} (${_body.companyName}) has rejected the candidate ${_body.candidateName}  for the position ${_body.positionName}`;
            await client.query(queryService.rejectFromHiring(_body));
            await emailService.rejectCandidateMail(_body, client);
          }
          await client.query(queryService.updateCurrentStage(_body));
          _body.responseMessage =
            _body.status == 1 ? `Our recruiters will immediately inform ${_body.candidateName} about the interview` : `You have rejected ${_body.candidateName} from your screening process`;
          _body.responseStatus = _body.status == 1 ? 1 : 2;
          await client.query(queryService.insertAuditLogForHiring(_body));
          await client.query(queryService.deleteRequestToken(_body));
          resolve({ code: 200, message: _body.responseMessage, data: { status: _body.responseStatus } });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> SEND BLUE
export const sendblueAPI = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;

        // Configure API key authorization: api-key
        const apiKey = defaultClient.authentications['api-key'];
        // eslint-disable-next-line no-undef
        apiKey.apiKey = process.env.SIBAPIKEY;

        // Uncomment below two lines to configure authorization using: partner-key
        // var partnerKey = defaultClient.authentications['partner-key'];
        // partnerKey.apiKey = 'YOUR API KEY';

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

        sendSmtpEmail = {
          sender: {
            name: 'Jyothis',
            email: 'jjoseph@ellow.io',
          },
          to: [
            {
              email: 'ashishpallikkunnel97@gmail.com',
              name: 'John Doe',
            },
          ],
          templateId: 3,
          params: {
            name: 'Ashish',
          },
          // "subject":"Hello",
          // "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Sendinblue.</p></body></html>"
        };
        console.log('Send');
        await apiInstance.sendTransacEmail(sendSmtpEmail);
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> SEND BLUE
export const sendinblueAddContact = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;

        const apiKey = defaultClient.authentications['api-key'];
        // eslint-disable-next-line no-undef
        apiKey.apiKey = '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';
        const results = await client.query(queryService.getContactDetails());
        const promise = [];

        const apiInstance = new SibApiV3Sdk.ContactsApi();
        if (Array.isArray(results.rows) && results.rowCount > 0) {
          results.rows.forEach(async (element) => {
            const createContact = new SibApiV3Sdk.CreateContact();
            createContact.email = element.email_address;
            createContact.attributes = { FIRSTNAME: element.candidate_first_name, LASTNAME: element.candidate_last_name, PHONE: element.phone_number };
            createContact.listIds = [10];
            promise.push(await apiInstance.createContact(createContact));
          });
        }

        await Promise.all(promise);
        resolve({ code: 200, message: 'Added successfully', data: {} });

        // const path = 'src/emailTemplates/addCandidateHirerMail.html';
        // const subjectLine = 'Test';
        // const replacements = {positionName: 'Software Developer', keys: {name: 'Nayan C', value: 'nayancjose@gmail.com'}, commments: 'Good attitude', link: 'dev.ellow.io/login'};

        // emailClient.emailManagerForNoReply('ashish.babu@ellow.io', subjectLine, path, replacements);
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Check action is already taken for reject and schedule interview for candidates applied to a position
export const checkAction = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const getCandidateDetailsFromToken = await client.query(queryService.getCandidateDetailsFromTokenQueryService(_body));
        if (getCandidateDetailsFromToken.rowCount == 0) {
          resolve({ code: 200, message: config.actionTaken.alreadyTaken, data: { actionTaken: true } });
        } else {
          resolve({ code: 200, message: config.actionTaken.freshAction, data: { actionTaken: false } });
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Update candidate contract start and end date
export const updateStartAndEndDate = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        if (utils.checkRate(_body.contractRate)) {
          switch (_body.action) {
            case 'add':
              await client.query('COMMIT');
              await client.query(queryService.updateContractDetails(_body));
              break;

            case 'update':
              
              await client.query(queryService.setOldContractToFalse(_body));
              await client.query(queryService.updateContractDetails(_body));

              // await client.query(queryService.updateContractStartAndEndDate(_body));
              break;

            default:
              reject(new Error({ code: 400, message: 'Invalid action', data: {} }.toString()));
          }

          if (utils.checkRate(_body.ellowRate)) {
            client.query(queryService.updateEllowRate(_body));
          }
          resolve({ code: 200, message: 'Success', data: {} });
        } else {
          reject(new Error({ code: 402, message: 'Malformed rate values, please check contract rate send' }.toString()));
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// Extract resume data and parse content from response
export const fullProfileResumeParser = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        var resumeCheck = await client.query(queryService.checkResumeExistance(_body));
        if (resumeCheck.rowCount == 0) {
          let responseData = null;

          const jsonObject = JSON.stringify({
            url: _body.publicUrl + encodeURIComponent(_body.fileName),
            userkey: 'IC8Q6BQ5',
            version: '8.0.0',
            subuserid: 'Deena Sasidhar',
          });

          // prepare the header
          const postheaders = {
            'Content-Type': 'application/json',
            // eslint-disable-next-line no-undef
            'Content-Length': Buffer.byteLength(jsonObject, 'utf8'),
          };

          // the post options
          const optionspost = {
            host: 'rest.rchilli.com',
            port: 80,
            path: '/RChilliParser/Rchilli/parseResume',
            method: 'POST',
            headers: postheaders,
          };

          console.info('Options prepared:');
          console.info(optionspost);
          console.info('Do the POST call');

          // do the POST call
          const reqPost = https
            .request(optionspost, function (res) {
              // uncomment it for header details
              //  console.log("headers: ", res.headers);
              let data = '';
              res.on('data', function (d) {
                console.info('POST result:\n');
                data += d;
                console.info('\n\nPOST completed');
              });

              res.on('end', async () => {
                // process.stdout.write(data);
                responseData = JSON.parse(data);
                if (responseData['error'] !== undefined) {
                  reject({ code: 400, message: 'Failed Please try again, parser error ', data: responseData['error'] });
                } else {
                  responseData['employeeId'] = _body.employeeId;
                  responseData['resume'] = _body.fileName;
                  responseData['candidateId'] = _body.candidateId;
                  responseData['userRoleId'] = _body.userRoleId;
                  responseData['companyId'] = _body.companyId;
                  responseData['ResumeParserData']['ResumeFileName'] = _body.fileName.substring(36);

                  const resp = await modifyFullProfileResumeData(responseData).catch((e) => {
                    console.log('error data received : ', e);

                    reject({ code: 400, message: 'Failed Please try again, parser error ', data: e.data });
                  });
                  resolve({ code: 200, message: 'Resume parsed successfully', data: { candidateId: resp['data'] } });
                }
              });
            })
            .on('error', (err) => {
              console.log('Error: ', err.message);
              reject({ code: 400, message: 'Error from parser', data: err.message });
            });
          // write the json data
          reqPost.write(jsonObject);
          reqPost.end();
          reqPost.on('error', function (e) {
            responseData = e.message;
          });
        } else {
          reject({ code: 400, message: 'The profile which you try to upload already exists with the platform', data: {} });
        }
      } catch (e) {
        console.log(e);
        reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>> Update resume data
export const modifyFullProfileResumeData = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        const extractedData = rchilliExtractor.rchilliExtractor(_body);
        let candidateId = null;
        extractedData['employeeId'] = _body.employeeId;
        extractedData['resume'] = _body.resume;
        extractedData['candidateId'] = _body.candidateId;
        await client.query(queryService.updateFullProfileResumeDetails(extractedData));
        let candidateExperienceResult = await client.query(queryService.getCandidateWorkExperience(extractedData));
        let candidateProjectResult = await client.query(queryService.getCandidateProjects(extractedData));
        let candidateEducationResult = await client.query(queryService.getCandidateEducation(extractedData));
        let candidateAwardResult = await client.query(queryService.getCandidateAwards(extractedData));
        let candidatePublicationsResult = await client.query(queryService.getCandidatePublications(extractedData));
        let candidateLanguagesResult = await client.query(queryService.getCandidateLanguages(extractedData));
        await client.query('COMMIT');
        try {
          let promises = [];

          if (candidateExperienceResult.rowCount == 0) {
            extractedData['workHistory'].map((data) => {
              data['candidateId'] = _body.candidateId;
              data['employeeId'] = _body.employeeId;
              promises.push(client.query(queryService.insertCandidateWorkHistoryQuery(data)));
            });

            await Promise.all(promises);
          }

          if (candidateProjectResult.rowCount == 0) {
            promises = [];
            extractedData['projects'].map((data) => {
              data['candidateId'] = _body.candidateId;
              data['employeeId'] = _body.employeeId;
              promises.push(client.query(queryService.insertExtractedCandidateProjectsQuery(data)));
            });

            await Promise.all(promises);
          }

          if (candidateEducationResult.rowCount == 0) {
            promises = [];
            extractedData['education'].map((data) => {
              data['candidateId'] = _body.candidateId;
              data['employeeId'] = _body.employeeId;
              promises.push(client.query(queryService.insertCandidateEducationQuery(data)));
            });

            await Promise.all(promises);
          }

          if (candidateAwardResult.rowCount == 0) {
            promises = [];
            extractedData['certifications'].map((data) => {
              data['candidateId'] = _body.candidateId;
              data['employeeId'] = _body.employeeId;
              promises.push(client.query(queryService.insertCandidateAwardQuery(data)));
            });
            await Promise.all(promises);
          }

          if (candidatePublicationsResult.rowCount == 0) {
            promises = [];
            extractedData['publications'].map((data) => {
              data['candidateId'] = _body.candidateId;
              data['employeeId'] = _body.employeeId;
              promises.push(client.query(queryService.insertCandidatePublicationQuery(data)));
            });

            await Promise.all(promises);
          }

          if (candidateLanguagesResult.rowCount == 0) {
            await client.query(queryService.insertExtractedLanguagesQuery(extractedData));
          }
          await client.query('COMMIT');

          return resolve({ code: 200, message: 'Candidate resume file updated successfully', data: candidateId });
        } catch (error) {
          console.log('error : ', error.message);
          reject(new Error({ code: 400, message: 'Error occured during extraction', data: error.message }.toString()));
        }
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Function to get freelancer ellow stages
export const getElloStage = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        console.log(_body.employeeId);
        var candidateResult = await client.query(queryService.getCandidateIdFromEmployeeId(_body));
        _body.candidateId = candidateResult.rows[0].candidate_id;
        var stageResult = await client.query(queryService.getFreelancerEllowStages(_body));
        stageResult.rows.forEach((element) => {
          if (element.stageName == 'Basic Profile Submission') element['icon'] = 'profile_icon.svg';
          else if (element.stageName == 'Full Profile Submission') element['icon'] = 'profile_submission_icon.svg';
          else if (element.stageName == 'ellow Technical Assessment') element['icon'] = 'technical assessment_icon.svg';
          else if (element.stageName == 'Certification') element['icon'] = 'ellow_certification_icon.svg';
          else element['icon'] = '';
        });
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Candidate Assesment Updated successfully', data: { stages: stageResult.rows } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>>>Function to edit the vetting status of the candidate.
export const googleSignIn = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        // Accessing users token for google
        const tokenResponse = await fetch(
          'https://accounts.google.com/o/oauth2/token?redirect_uri=https%3A%2F%2Fcandidate.ellow.io%2Fapi%2Fv1%2Fcandidates%2FgoogleSign&client_id=50243101957-grtcrpsmm98cg96me7b6vve0phpfdupp.apps.googleusercontent.com&client_secret=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&grant_type=authorization_code&code='+_body.code,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Host: 'accounts.google.com',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ a: 1, b: 'Textual content' }),
          },
        );
        const content = await tokenResponse.json();
        console.log(content);
        let oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: content.access_token }); // use the new auth client with the access_token
        let oauth2 = google.oauth2({
          auth: oauth2Client,
          version: 'v2',
        });
        let { data } = await oauth2.userinfo.get();

        // Data Check from database
        (_body.email = data.email), (_body.firstName = data.given_name), (_body.lastName = data.family_name);
        let employeeCheck = await client.query(queryService.getEmail(_body));
        if (employeeCheck.rowCount == 1) {
          _body.employeeId = employeeCheck.rows[0].employee_id;
          _body.companyId = employeeCheck.rows[0].company_id;
          _body.userRoleId = employeeCheck.rows[0].user_role_id;
        } else {
          let employeeEntry = await client.query(queryService.googleSSOEmployeeInsertion(_body));
          let candidateEntry = await client.query(queryService.insertIntoCandidate(_body));
          _body.employeeId = employeeEntry.rows[0].employee_id;
          _body.companyId = employeeEntry.rows[0].company_id;
          _body.userRoleId = employeeEntry.rows[0].user_role_id;
          _body.candidateId = candidateEntry.rows[0].candidate_id;
          await client.query(queryService.insertInToCandidateEmployee(_body));
        }
        _body.token = jwt.sign(
          {
            employeeId: _body.employeeId.toString(),
            companyId: _body.companyId.toString(),
            userRoleId: _body.userRoleId.toString(),
          },
          process.env.TOKEN_SECRET,
          { expiresIn: '24h' },
        );
        await client.query(queryService.insertEmployeeGoogleToken(_body));
        await client.query('COMMIT');

        resolve({ code: 200, message: 'Candidate SSO successfull', data: { token: _body.token } });
      } catch (e) {
        await client.query('ROLLBACK');
        console.log(e);
        reject({ code: 400, message: 'Failed. Please try again.', data: {} });
      }
    })().catch(() => {
      reject({ code: 400, message: 'Failed. Please try again.', data: {} });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> SEND BLUE CERTIFIED LIST
export const devSendinblueCertifiedList = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;

        const apiKey = defaultClient.authentications['api-key'];
        // eslint-disable-next-line no-undef
        apiKey.apiKey = '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';
        const results = await client.query(queryService.getCertifiedContactDetails());
        const promise = [];

        const apiInstance = new SibApiV3Sdk.ContactsApi();
        if (Array.isArray(results.rows) && results.rowCount > 0) {
          results.rows.forEach(async (element) => {
            const createContact = new SibApiV3Sdk.CreateContact();
            createContact.email = element.email_address;
            createContact.attributes = { FIRSTNAME: element.candidate_first_name, LASTNAME: element.candidate_last_name, PHONE: element.phone_number };
            createContact.listIds = [17];
            promise.push(await apiInstance.createContact(createContact));
          });
        }

        await Promise.all(promise);
        resolve({ code: 200, message: 'Added successfully', data: {} });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject({ code: 400, message: 'Failed. Please try again ', data: e.message });
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Function to add referrals by candidate
export const addReferral = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        var candidateResult = await client.query(queryService.getCandidateIdFromEmployeeId(_body));
        _body.candidateId = candidateResult.rows[0].candidate_id;
        _body.referralList = [];
        _body.nonReferralList = [];
        // Verifying and Saving candidate's details
        _body.candidateList.forEach(async (element) => {
          element.emailAddress = element.emailAddress.trim();
          var results = await client.query(queryService.getReferalDetailsFromEmail(_body));
          if (results.rowCount == 0) {
            (element.token = nanoid()), (element.candidateId = _body.candidateId), (element.candidateName = candidateResult.rows[0].name), (element.candidateEmail = candidateResult.rows[0].email);
            var referralesult = await client.query(queryService.candidateReferralInsertion(element));
            await client.query('COMMIT');
            await emailService.referralCandidateWelcomeMail(element);
            _body.referralList.push({ referralId: referralesult.rows[0].candidate_referral_id, name: element.name, emailAddress: element.emailAddress, phoneNumber: element.phoneNumber });
          } else {
            _body.nonReferralList.push({ name: element.name, emailAddress: element.emailAddress, phoneNumber: element.phoneNumber });
          }
        });
        await client.query('COMMIT');
        resolve({ code: 200, message: 'Referral Added successfully', data: { referredList: _body.referralList, nonReferredList: _body.nonReferralList } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Function to check referral mails by candidate
export const checkReferralMail = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        // Verifying and Saving candidate's details
        var results = await client.query(queryService.getReferalDetailsFromEmail(_body));
        if (results.rowCount == 0) {
          resolve({ code: 200, message: 'Success', data: 'Success' });
        } else {
          reject({ code: 400, message: 'Failed ', data: 'Success' });
        }
        await client.query('COMMIT');
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Candidate Referral List
export const candidateReferralList = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        var candidateResult = await client.query(queryService.getCandidateIdFromEmployeeId(_body));
        _body.candidateId = candidateResult.rows[0].candidate_id;
        const selectQuery = candidateQuery.candidateReferralList;
        const totalQuery = candidateQuery.candidateReferralListTotalCount;

        let queryText = '';
        let searchQuery = '';
        let queryValues = {};

        const searchResult = utils.referralSearch(_body, queryValues);
        searchQuery = searchResult.searchQuery;
        queryValues = searchResult.queryValues;

        queryText = selectQuery + searchQuery + utils.referralSort(_body) + utils.resourcePagination(_body);
        queryValues = Object.assign({ candidateid: _body.candidateId }, queryValues);

        const queryCountText = totalQuery + searchQuery;

        var referralList = await client.query(queryService.getCandidateReferalList(queryText, queryValues));
        const totalCount = await client.query(queryService.getCandidateReferalListTotalCount(queryCountText, queryValues));

        await client.query('COMMIT');
        resolve({ code: 200, message: 'Referral Added successfully', data: { referralList: referralList.rows, totalCount: totalCount.rows[0].totalCount } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Exception({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Exception({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Get Email Address from Token
export const getEmailAddressFromReferralToken = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        var result = await client.query(queryService.getEmailFromReferralToken(_body));
        if (result.rowCount == 0) {
          reject({ code: 400, message: 'Email Address not found ', data: 'No Email Address Found' });
        } else {
          resolve({ code: 200, message: 'Referral Added successfully', data: { email: result.rows[0].email_address, firstName: '', lastName: '', telephoneNumber: '' } });
        }
        await client.query('COMMIT');
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Candidate Referral List
export const candidateAdminReferralList = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        const selectQuery = candidateQuery.candidateAdminReferralList;
        const totalQuery = candidateQuery.candidateAdminReferralListTotalCount;

        let queryText = '';
        let searchQuery = '';
        let queryValues = {};

        const searchResult = utils.referralSearch(_body, queryValues);
        searchQuery = searchResult.searchQuery;
        queryValues = searchResult.queryValues;

        queryText = selectQuery + searchQuery + utils.referralSort(_body) + utils.resourcePagination(_body);
        queryValues = Object.assign(queryValues);

        const queryCountText = totalQuery + searchQuery;

        var referralList = await client.query(queryService.getCandidateReferalList(queryText, queryValues));
        const totalCount = await client.query(queryService.getCandidateReferalListTotalCount(queryCountText, queryValues));

        await client.query('COMMIT');
        resolve({ code: 200, message: 'Referral Added successfully', data: { referralList: referralList.rows, totalCount: totalCount.rows[0].totalCount } });
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Exception({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Exception({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};




// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Get signed up candidate details
export const getSignedupCandidateDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        var result = await client.query(queryService.getCandidateBasicDetails(_body));
        resolve({ code: 200, message: 'Details listed successfully', data: result.rows[0] });
        
        await client.query('COMMIT');
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Get reporter Details
export const addReporterDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        var result = await client.query(queryService.addReporter(_body));
        resolve({ code: 200, message: 'Details listed successfully', data: result.rows[0] });
        
        await client.query('COMMIT');
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Update reporter initial feedback Details
export const updateReporterInitialFeedback = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        var result = await client.query(queryService.updateInitialFeedback(_body));
        resolve({ code: 200, message: 'Details listed successfully', data: result.rows[0] });
        
        await client.query('COMMIT');
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};



// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Update reporter final feedback Details
export const updateReporterFinalFeedback = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        var result = await client.query(queryService.updateFinalFeedback(_body));
        resolve({ code: 200, message: 'Details listed successfully', data: result.rows[0] });
        
        await client.query('COMMIT');
      } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};