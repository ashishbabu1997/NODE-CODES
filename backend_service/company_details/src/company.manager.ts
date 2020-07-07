import companyQuery  from './query/company.query';
import database from './common/database/database';

export const get_Details = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get_details',
            text: companyQuery.get_details,
            values: [_body.company_id],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(query);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve(results.rows[0].company_id);
        })
    });
}