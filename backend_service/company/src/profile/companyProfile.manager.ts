import companyQuery  from './query/query';
import database from '../common/database/database';
import {Promise} from 'es6-promise'

export const get_Details = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get_details',
            text: companyQuery.getProfiles,
            values: [_body],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile listed successfully", data: { Profile: results.rows } });
        })
    });
}
export const update_Details = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update_details',
            text: companyQuery.updateProfileDetails,
            values: [_body.profileUrl, _body.description, _body.logo, _body.coverPage, _body.tagline, _body.facebookId, _body.instagramId,_body.twitterId, _body.linkedinId,parseInt(_body.companyId)]
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
