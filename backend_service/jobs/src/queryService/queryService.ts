import positionsQuery from '../positions/query/positions.query';



const currentTime = () => {return new Date().getTime()} 


// ------------------------------------------ Modify Resume builder queries ---------------------------------------//
export const getCompanyPositionsQuery = (_body) => {
    return {
        name: 'id-fetch-company-positions',
        text: _body.queryText,
        values:_body.queryValues
    }
}
export const addCompanyPositionsQuery = (_body) =>  {
    return {
        name: 'add-company-positions',
        text: positionsQuery.addCompanyPositions,
        values: {
            name:_body.positionName, devcount:_body.developerCount, companyid:_body.companyId,
            explevel:_body.experienceLevel, jobdesc:_body.jobDescription, doc:_body.document, 
            currencyid:_body.currencyTypeId, billingtype:_body.billingType, 
            empid:_body.employeeId,  time:currentTime(), jobcatid:_body.jobCategoryId
        }
    }
}
export const getCompanyNameQuery = (_body) => {
    return{
        name: 'get-company-name',
        text: positionsQuery.getCompanyName,
        values: [_body.compId]
    }
}