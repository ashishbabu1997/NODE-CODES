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
