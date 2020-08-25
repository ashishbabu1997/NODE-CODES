import profileQuery from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'

export const getPercentage= (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-percentage',
            text: profileQuery.getProfilePercentage,
            values: [_body.companyId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            else{

                resolve({ code: 200, message: "Profile percentage retrieved", data: {profilePercentage:results.rows[0].profilePercentage} });

            }
        })
    })
}