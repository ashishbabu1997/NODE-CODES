import positionsQuery from '../positions/query/positions.query';
import jobReceivedQuery from '../jobreceived/query/jobreceived.query';
import * as format from 'pg-format';

const currentTime = () => {return new Date().getTime()} 


// ------------------------------------------ Job Received Queries ---------------------------------------//

export const getJobRecievedQuery = (_body) => {
    return {
        name: 'get-all-positions-provider',
        text: _body.queryText,
        values: _body.queryValues,
    }
}
export const  getJobReceivedByIdQuery = (_body) =>{
    return {
        name: 'get-JobReceivedByJobReceivedId',
        text: jobReceivedQuery.getJobReceivedById,
        values: [parseInt(_body.jobReceivedId), parseInt(_body.companyId)]
    }
}
export const  updateJobReceivedRejectQuery = (_body) =>{
    return {
        name: 'update-JobReceived-reject',
        text: jobReceivedQuery.updateReject,
        values: [_body.jobReceivedId, _body.companyId, _body.reject, _body.employeeId, currentTime()]
    }
}
export const  getProfileByCompanyIdQuery = (_body) =>{
    return {
        name: 'get-ProfileByCompanyId',
        text: _body.selectQuery,
        values: [parseInt(_body.companyId), parseInt(_body.positionId)]
    }
}
export const  checkEMailExistenceQuery = (_body) =>{
    return {
        name: 'check-mail',
        text: jobReceivedQuery.checkEMail,
        values: [_body.email],
    }
}
export const  saveCandidateQuery = (_body) =>{
    return {
        name: 'add-Profile',
        text: format(jobReceivedQuery.addProfile, [_body.candidates]),
    }
}
export const  getCompanyName = (_body) =>{
    return {
        name: 'add-company-name',
        text: jobReceivedQuery.fetchCompanyName,
        values: [_body.sellerCompanyId],

    }
}

export const  addEmployee = (_body) =>{
    return {
        name: 'add-employee',
        text: jobReceivedQuery.addEmployee,
        values: [_body.firstName, _body.lastName,_body.sellerCompanyId, _body.email, _body.phoneNumber, currentTime()]   

    }
}
export const  addPositionQuery = (_body) =>{
    return {
        name: 'add-position',
        text: jobReceivedQuery.addCandidatePosition,
        values: [_body.positionId, _body.candidateId, _body.jobReceivedId, _body.billingTypeId, _body.currencyTypeId, _body.employeeId, currentTime()],

    }
}
export const  getJobStatusQuery = (_body) =>{
    return {
        name: 'get-Job-status',
        text: jobReceivedQuery.getJobStatus,
        values: [_body.positionId],

    }
}
export const  updateCompanyJobStatusQuery = (_body) =>{
    return {
        name: 'update-company-job-status',
        text: jobReceivedQuery.updateCompanyJobStatus,
        values: [_body.jobReceivedId, _body.jobStatus, _body.sellerCompanyId, _body.employeeId, currentTime()],

    }
}
export const  updateCandidateStatus = (_body) =>{
    return {
        name: 'update-candidate-status',
        text: jobReceivedQuery.updateCandidateStatus,
        values: [_body.candidateId, _body.employeeId, currentTime()],

    }
}
export const  addDefaultTraits = (_body) =>{
    return {
        name: 'add-default-traits',
        text: jobReceivedQuery.addDefaultAssessmentTraits,
        values: {candidateid:_body.candidateId, employeeid:_body.employeeId, currenttime:currentTime()},

    }
}
export const  updatePasswordToEmployee = (_body) =>{
    return {
        name: 'update-password',
        text: jobReceivedQuery.updatePassword,
        values: [_body.hashedPassword,true,1,_body.emailAddress],

    }
}
export const  deleteCandidateSkillsQuery = (_body) =>{
    return {
        name: 'delete-candidate-skills',
        text: jobReceivedQuery.deleteCandidateSkills,
        values: [_body.candidateId, _body.skillSet],

    }
}

// ------------------------------------------ Position Queries ---------------------------------------//

export const  fetchCompanyPositionsById = (_body) =>{
    return {
        name: 'id-fetch-company-positions',
        text: _body.queryText,
        values: _body.queryValues

    }
}
export const  addCompanyPositionsQuery = (_body) =>{
    return {
        name: 'add-company-positions',
        text: positionsQuery.addCompanyPositions,
        values: {
            name:_body.positionName, devcount:_body.developerCount, companyid: _body.cmpId,
            explevel:_body.experienceLevel, jobdesc:_body.jobDescription, doc:_body.document, 
            currencyid:_body.currencyTypeId, billingtype:_body.billingType, 
            empid:_body.employeeId,  time:currentTime(), jobcatid:_body.jobCategoryId
        }
    }
}
export const  getCompanyNameQuery = (_body) =>{
    return {
        name: 'get-company-name',
        text: positionsQuery.getCompanyName,
        values: [_body.cmpId]

    }
}
export const  addTopSkillsQuery = (_body) =>{
    return {
        name: 'add-top-job-skills',
        text: positionsQuery.addJobSkills,
        values: [ _body.positionId,  _body.tSkill,true, currentTime()],

    }
}
export const  addOtherSkillsQuery = (_body) =>{
    return {
        name: 'add-other-job-skills',
        text: positionsQuery.addJobSkills,
        values: [ _body.positionId,  _body.oSkill,false, currentTime()],

    }
}
export const  fetchPositionDetails = (_body) =>{
    return {
        name: 'fetch-position-details',
        text: positionsQuery.getPositionDetailsQuery,
        values: [parseInt(_body.positionId)],

    }
}
export const  updateCompanyPositionsFirstQuery = (_body) =>{
    return {
        name: 'update-company-positions-first',
        text: positionsQuery.updatePositionFirst,
        values: [_body.positionName, _body.locationName, _body.developerCount,
            _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document,
            _body.employeeId, currentTime(), _body.positionId, _body.clientCompanyId, _body.jobCategoryId]
    }
}
export const  updateCompanyPositionsSecondQuery = (_body) =>{
    return {
        name: 'update-company-positions-second',
        text: positionsQuery.updatePositionSecond,
        values: [_body.contractStartDate,
            _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget,
            _body.employeeId, currentTime(), _body.positionId, _body.cmpId,_body.contractDuration,_body.immediate]
    }
}
export const  deleteJobSkillsQuery = (_body) =>{
    return {
        name: 'delete-job-skills',
        text: positionsQuery.deletePositionSkills,
        values: [_body.positionId,  _body.skillSet],

    }
}
export const  changePositionStatusQuery = (_body) =>{
    return {
        name: 'change-position-status',
        text: positionsQuery.changePositionStatus,
        values: [_body.positionId, currentTime()]

    }
}
export const  addPositionToJobReceivedQuery = (_body) =>{
    return {
        name: 'add-position-to-job-received',
        text: positionsQuery.addPositionToJob,
        values: [_body.positionId, currentTime()],

    }
}
export const  getNotificationDetailsQuery = (_body) =>{
    return {
        name: 'get-notification-details',
        text: positionsQuery.getNotificationDetails,
        values: [_body.positionId]

    }
}
export const  positionQuery = (_body) =>{
    return {
        name: 'change-job-status',
        text: positionsQuery.changeJobStatus,
        values: [currentTime(), _body.positionId,_body.jobStatus],

    }
}
export const  changeJobReceivedStatusQuery = (_body) =>{
    return {
        name: 'change-job-received-status',
        text: positionsQuery.changeJobReceivedStatus,
        values: [currentTime, _body.positionId,_body.jobStatus],

    }
}
export const  getMailAddress = (_body) =>{
    return {
        name: 'fetch-emailaddress',
        text:positionsQuery.getEmailAddressOfBuyerFromPositionId,
        values:[_body.positionId]

    }
}
