import companyQuery  from './query/query';
import database from '../common/database/database';

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
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            resolve(results.rows[0].company_id);
        })
    });
}
export const update_Details = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update_details',
            text: companyQuery.update_details,
            values: [_body.companyId, _body.profileUrl, _body.description,_body.logo,_body.coverPage,_body.tagline,_body.facebookId,_body.instagramId,
                _body.twitterId,_body.linkedinId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to update profile. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile updated successfully", data: {} });
        })
    })
}