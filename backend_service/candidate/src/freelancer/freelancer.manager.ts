import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import config from '../config/config';
import freelancerQuery from './query/freelancer.query';
import * as utils from '../utils/utils';
import * as emailService from '../emailService/freelancerEmail';
import * as sendinblueService from '../sendinblueServices/freelancerSendinblueMails';

export const listJobs = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        let filterQuery = '';
        let queryValues = { search: '%%' };

        if (![null, undefined, ''].includes(_body.filterSkillId)) {
          filterQuery = config.textReferences.listJobsFilterQuery;
          queryValues = Object.assign({ skillid: _body.filterSkillId }, queryValues);
        }

        if (![null, undefined, ''].includes(_body.searchKey)) {
          queryValues.search = '%' + _body.searchKey + '%';
        }
        const result = await client.query(queryService.listJobPositions(filterQuery, queryValues));

        await client.query('COMMIT');
        resolve({ code: 200, message: 'Freelancer jobs listed successfully', data: result.rows });
      } catch (e) {
        console.error(e);
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

export const modifyGeneralInfo = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query(queryService.modifyFreelancerProfileDetailsQuery(_body));
        _body.availability = _body.readyToStart == 0 ? false : true;
        await client.query(queryService.modifyCandidateAvailabilityQuery(_body));
        await client.query(queryService.addWorkExperiences(_body));
        await client.query(queryService.modifySocialProfileAndStatusUpdate(_body));
        _body.skillSet = ![undefined, null].includes(_body.skills) ? _body.skills.map((a) => a.skill.skillId) : [];
        await client.query(queryService.deleteCandidateSkillsQuery(_body));
        if (Array.isArray(_body.skills)) {
          let promise = [];

          _body.skills.forEach(async (element) => {
            _body.competency = element.competency === '' ? null : element.competency;
            _body.preffered = element.preferred;
            _body.skillId = element.skill['skillId'];
            _body.yearsOfExperience = element.yoe === '' ? null : element.yoe;
            _body.skillVersion = element.skillVersion === '' ? null : element.skillVersion;
            promise.push(client.query(queryService.addCandidateSkills(_body)));
          });
          await Promise.all(promise);
        }
        await client.query(queryService.addDefaultTraits(_body));
        await client.query('COMMIT');
        _body.currentEllowStage = _body.reviewStepsId = 1;
        _body.ellowRecruitmentStatus = config.ellowRecruitmentStatus.complete;
        await client.query(queryService.updateProfileReview(_body));
        await client.query(queryService.updateEllowRecruitmentStatus(_body));
        let results = await client.query(queryService.getCandidatesProfile(_body));
        let data = results.rows[0];
        (_body.firstName = data.candidate_first_name),
          (_body.lastName = data.candidate_last_name),
          (_body.email = data.email_address),
          (_body.telephoneNumber = data.phone_number),
          (_body.listId = config.sendinblue.certifiedListId);
        _body.listId = config.sendinblue.signupList;
        sendinblueService.sendinblueDeleteContact(_body);
        _body.listId = config.sendinblue.basicProfileList;
        sendinblueService.sendinblueAddResources(_body);

        resolve({ code: 200, message: 'Freelancer General info updated successfully', data: {} });
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

export const modifyOtherInfoAndSubmit = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        await client.query('BEGIN');
        _body.candidateStatus = config.integerReferences.draftCandidateStatusValue;

        _body.idSet = Array.isArray(_body.cloudProficiency) ? _body.cloudProficiency.map((a) => a.cloudProficiencyId).filter(Number) : false;
        if (_body.idSet) {
          await client.query(queryService.deleteCandidateCloudQuery(_body));
          await client.query(queryService.insertCandidateCloudQuery(_body));
        }

        // await client.query(queryService.modifySocialProfileAndStatusUpdate(_body));
        await client.query(queryService.candidateStatusUpdate(_body));
        await client.query('COMMIT');

        resolve({ code: 200, message: 'Freelancer other info updated and finished successfully', data: {} });
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

export const submitFreelancerProfile = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        _body.candidateStatus = config.integerReferences.profileSubmissionStatusValue;
        await client.query('COMMIT');
        (_body.currentEllowStage = 2), (_body.reviewStepsId = 6);
        _body.ellowRecruitmentStatus = config.ellowRecruitmentStatus.complete;
        let results = await client.query(queryService.getCandidatesProfile(_body));
        let data = results.rows[0];
        (_body.firstName = data.candidate_first_name),
          (_body.lastName = data.candidate_last_name),
          (_body.email = data.email_address),
          (_body.telephoneNumber = data.phone_number),
          (_body.listId = config.sendinblue.certifiedListId);
        _body.listId = config.sendinblue.basicProfileList;
        sendinblueService.sendinblueDeleteContact(_body);
        _body.stepId = 2;
        let stageStatusResult = await client.query(queryService.getStageStatus(_body));
        if (stageStatusResult.rows[0].stage_status == 2) {
          _body.listId = config.sendinblue.fullProfileList;
          sendinblueService.sendinblueDeleteContact(_body);
        }

        await client.query(queryService.updateProfileReview(_body));
        await client.query(queryService.updateEllowRecruitmentStatus(_body));
        await emailService.submitFreelancerProfileEmail(_body, client);
        resolve({ code: 200, message: 'Freelancer submitted successfully', data: {} });
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

export const getFreelancerStatus = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        const result = await client.query(queryService.getCandidateStatuses(_body));
        resolve({ code: 200, message: 'Candidate status listed successfully', data: { data: result.rows[0] } });
      } catch (e) {
        console.error('Error raised from try : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      console.error('Error raised from async : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const getPositionDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database().connect();
      try {
        var candidateResult = await client.query(queryService.getCandidateIdFromEmployeeId(_body));
        _body.candidateId = candidateResult.rows[0].candidate_id;
        const result = await client.query(queryService.getDetailsPosition(_body));
        resolve({ code: 200, message: 'Candidate positions details listed successfully', data: result.rows });
      } catch (e) {
        console.error('Error raised from try : ', e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      } finally {
        client.release();
      }
    })().catch((e) => {
      console.error('Error raised from async : ', e);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

export const listFreelancers = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');

        await client.query('COMMIT');

        resolve({ code: 200, message: 'Freelancer other info updated and finished successfully', data: {} });
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
// >>>>>>>>>>>Listing all the draft freelancers from the candidates list.
export const listDraftFreelancersDetails = (_body) => {
  return new Promise((resolve, reject) => {
    const selectQuery = freelancerQuery.listDraftFreelancersFromView;
    const totalQuery = freelancerQuery.listDraftFreelancersTotalCount;
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
        queryText = selectQuery + filterQuery + searchQuery + utils.resourceSort(body) + utils.resourcePagination(body);
        queryValues = Object.assign({ positionid: body.positionId, employeeid: body.employeeId }, queryValues);
        const candidateList = await client.query(queryService.listCandidates(queryText, queryValues));

        const queryCountText = totalQuery + utils.resourceTab(body) + filterQuery + searchQuery;
        const candidateTotal = await client.query(queryService.listCandidatesTotal(queryCountText, queryValues));

        const candidates = candidateList.rows;
        const totalCount = candidateTotal.rows[0].totalCount;

        resolve({ code: 200, message: 'Candidate Listed successfully', data: { candidates, totalCount } });
      } catch (e) {
        console.error(e);
        await client.query('ROLLBACK');
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      }
    })().catch((e) => {
      console.error(e.message);
      reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
    });
  });
};

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>> Get freelancer applied Jobs
export const getFreelancerAppliedJobs = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        console.log(_body);
        var candidateResult = await client.query(queryService.getCandidateIdFromEmployeeId(_body));
        _body.candidateId = candidateResult.rows[0].candidate_id;
        const upcomingInterviews = await client.query(queryService.getFreelancerAppliedJobsDetails(_body));
        resolve({ code: 200, message: 'Successs', data: upcomingInterviews.rows });
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
// >>>>>>>>>>> Get candidate contract details
export const getFreelancerContractDetails = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        var candidateResult = await client.query(queryService.getCandidateIdFromEmployeeId(_body));
        _body.candidateId = candidateResult.rows[0].candidate_id;
        const contractDetails = await client.query(queryService.getFreelancerContactDetails(_body));
        resolve({ code: 200, message: 'Successs', data: contractDetails.rows });
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
// >>>>>>>>>>> Get candidate assessment link
export const getCandidateAssesmentLink = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        var candidateResult = await client.query(queryService.getCandidateIdFromEmployeeId(_body));
        _body.candidateId = candidateResult.rows[0].candidate_id;
        const assessmentDetails = await client.query(queryService.getCandidateAssessmentLinks(_body));
        _body.response = assessmentDetails.rowCount == 0 ? { assessmentLink: null, assessmentLinkText: null } : assessmentDetails.rows[0];
        resolve({ code: 200, message: 'Successs', data: _body.response });
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
