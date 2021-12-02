import * as employeeQuery from '../query/employee.query'

const currentTime = () => { return new Date().getTime() }


// ------------------------------------------Employee queries---------------------------------------//
export const getCompanyAccountType = (_body) => {
    return {
        name: 'get-company-account-type',
        text:employeeQuery.default.getAccountType,
        values: [_body],
    }
}


export const getDetailsFromReferralToken = (_body) => {
    return {
        name: 'get-details-referral-token',
        text:employeeQuery.default.getDetailsFromReferralToken,
        values: [_body.token],
    }
}
export const updateCandidateReferralStatus = (_body) => {
    return {
        name: 'update-referral-status',
        text:employeeQuery.default.updateReferralStatus,
        values: [_body.token],
    }
}