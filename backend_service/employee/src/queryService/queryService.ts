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