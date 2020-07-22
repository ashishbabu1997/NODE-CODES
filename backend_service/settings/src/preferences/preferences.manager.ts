import preferencesQuery from './query/preferences.query';
import database from '../common/database/database';

export const getPreferences = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-company-preferences',
            text: preferencesQuery.getCompanyPreferences,
            values: [parseInt(_body.companyId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Preferences listed successfully", data: results.rows[0] });
        })
    });
}

export const updateCompanyProfilePreferences = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-company-profile',
            text: preferencesQuery.updateCompanyProfile,
            values: [_body.companyId, _body.companyProfile, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Company profile updated successfully", data: {} });
        })
    })
}

export const enableMasking = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-company-masking',
            text: preferencesQuery.updateCompanyMasking,
            values: [_body.companyId, _body.masking, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Preferences updated successfully", data: {} });
        })
    })
}