import employeeQuery from '../employee/query/employee.query';
import companyQuery from '../profile/query/query'
import locationQuery from '../locations/query/locations.query'


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
        values: [_body.companyId, _body.userId,currentTime(),_body.employeeId]
    }
}


export const updateActiveState = (_body) => {
    return {
        name: 'update-active-state',
        text: employeeQuery.updateActiveState,
        values: [_body.companyId, _body.userId,currentTime(),_body.employeeId]
    }
}

export const addEmploye = (_body) => {
    return {
        name: 'add-employee-details',
        text: employeeQuery.addEmploye,
        values: [_body.firstName, _body.lastName, _body.userCompanyId, _body.email, _body.roleId, currentTime(), _body.contactNumber, true, _body.document, 3,_body.account_type,currentTime(),_body.employeeId,currentTime(),_body.employeeId],
    }
}

export const updateEmployee = (_body) => {
    return {
        name: 'update-employee-details',
        text: employeeQuery.updateEmployee,
        values: [_body.empId, _body.firstName, _body.lastName, _body.roleId, _body.phoneNumber,currentTime(),_body.employeeId]
    }
}

export const getEmployeeData = (_body) => {
    return {
        name: 'get-data-employees',
        text: employeeQuery.getEmployeeData,
        values: [_body.empId]
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
        values: [_body.profileUrl, _body.description, _body.logo, _body.coverPage, _body.tagline, _body.linkedinId, _body.count,_body.userCompanyId, _body.accountType, _body.roleId, _body.website, _body.companySizeId, _body.currencyTypeId,currentTime(),_body.employeeId]
    }
}

export const updateCompanyLogo = (_body) => {
    return {
        name: 'update-company-logo',
        text: companyQuery.updateLogo,
        values: [_body.userCompanyId, _body.fileName,currentTime(),_body.employeeId],
    }
}

export const updateCompanyCoverPage = (_body) => {
    return  {
        name: 'update-profile',
        text: companyQuery.updateCoverPic,
        values: [_body.userCompanyId, _body.fileName,currentTime(),_body.employeeId],
    }
}


// ------------------------------------------Location queries---------------------------------------//

export const fetchCompanyLocations = (_body) => {
    return {
        name: 'fetch-company-locations',
        text: locationQuery.getCompanyLocations,
        values: [_body.userCompanyId],
    }
}

export const addCompanyLocations = (_body) => {
    return {
        name: 'add-company-locations',
        text: locationQuery.addCompanyLocations,
        values: [_body.userCompanyId, _body.streetAddress1, _body.streetAddress2, _body.zipCode, _body.city, _body.stateId, _body.countryId,_body.gstNumber,_body.panNumber,_body.employeeId],
    }
}

export const updateCompanyLocations = (_body) => {
    return {
        name: 'update-company-locations',
        text: locationQuery.updateCompanyLocations,
        values: [_body.streetAddress1, _body.streetAddress2, _body.zipCode, _body.city, _body.stateId, _body.countryId, _body.locationId, _body.userCompanyId,_body.employeeId]
    }
}

export const deleteCompanyLocations = (_body) => {
    return {
        name: 'delete-company-locations',
        text: locationQuery.deleteCompanyLocations,
        values: [_body.locationId]
    }
}