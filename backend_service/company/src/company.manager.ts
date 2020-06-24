import companyQuery from './query/company.query';
import database from './common/database/database';

export default class CompanyManager {
    constructor() { }

    fetchCompanyLocations = (_body) => {
        return new Promise((resolve, reject) => {
            const query = {
                name: 'fetch-company-locations',
                text: companyQuery.getCompanyLocations,
                values: [parseInt(_body.companyId)],
              }
            database().query(query, (error, results) => {
                console.log(results, error)
                if (error) {
                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Success", data: { locations: results.rows } });
            })
        })
    }

}