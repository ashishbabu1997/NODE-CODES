import employeeQuery from '../employee/query/employee.query';
import companyQuery from '../profile/query/query'


const currentTime = () => { return new Date().getTime() }


// ------------------------------------------Employee queries---------------------------------------//
export const getEmployeeDetailsFromCompanyId = (_body, query) => {
    return {
        name: 'get-EmployeesByCompanyId',
        text: query,
        values: [_body.userCompanyId],
    }
}

export const getCompanyIdFromEmployeeId = (_body) => {
    return {
        name: 'get-companyid-from-empoyeeid',
        text: employeeQuery.getCompanyId,
        values: [_body.userId]
    }
}


export const updatePrimaryContact = (_body) => {
    return {
        name: 'update-primary-contact',
        text: employeeQuery.updatePrimaryContact,
        values: [_body.companyId, _body.userId]
    }
}


export const updateActiveState = (_body) => {
    return {
        name: 'update-active-state',
        text: employeeQuery.updateActiveState,
        values: [_body.companyId, _body.userId]
    }
}


// -------------------------------------------------- Company profile queries---------------------------------------//


export const getCompanyProfile = (_body) => {
    return {
        name: 'get-company-profile-details',
        text: companyQuery.getProfiles,
        values: [_body.userCompanyId],
    }
}

export const getProfilePercentage = (_body) => {
    return{
        name: 'get-profile-percentage',
        text: companyQuery.getProfilePercentage,
        values: [_body.userCompanyId],
    }
}

export const updateCompanyProfile = (_body) => {
    return {
        name: 'update-company-profile-details',
        text: companyQuery.updateProfileDetails,
        values: [_body.profileUrl, _body.description, _body.logo, _body.coverPage, _body.tagline, _body.linkedinId, _body.count,_body.userCompanyId, _body.accountType, _body.roleId, _body.website, _body.companySizeId, _body.currencyTypeId]
    }
}

export const updateCompanyLogo = (_body) => {
    return {
        name: 'update-company-logo',
        text: companyQuery.updateLogo,
        values: [_body.userCompanyId, _body.fileName],
    }
}

export const updateCompanyCoverPage = (_body) => {
    return  {
        name: 'update-profile',
        text: companyQuery.updateCoverPic,
        values: [_body.userCompanyId, _body.fileName],
    }
}