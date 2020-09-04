import profileQuery from './query/query';
import database from '../common/database/database';

export const getCompanyDetails = (_body) => {
    return new Promise((resolve, reject) => {
    const query = {
            name: 'get-EmployeesByCompanyId',
            text: profileQuery.getProfiles,
            values: [parseInt(_body.companyId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Employees listed successfully", data: { Employees: results.rows } });
        })
    })
}