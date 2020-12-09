import preferencesQuery from './query/preferences.query';
import database from '../common/database/database';



 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get the company currency preference
export const getPreferences = (_body) => {
    return new Promise((resolve, reject) => {
        const fetchQuery = {
            name: 'fetch-company-preferences',
            text: preferencesQuery.getCompanyPreferences,
            values: [_body.companyId],
        }
        database().query(fetchQuery, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }            
            resolve({ code: 200, message: "Preferences listed successfully", data: results.rows[0] });
        })
    });
}



 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update cthe preference
export const updateCompanyProfilePreferences = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-company-profile',
            text: preferencesQuery.updateCompanyProfile,
            values: [_body.companyId, _body.currencyTypeId, currentTime],
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


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Hide the details of company while projection
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