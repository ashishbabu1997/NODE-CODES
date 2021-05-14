import certificationQuery from './query/certification.query';
import database from '../common/database/database';


 // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Fetch certifications updated by a company  
export const fetchCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-company-Certifications',
            text: certificationQuery.getCompanyCertifications,
            values: [parseInt(_body.companyId)]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certifications listed successfully", data: { certifications: results.rows } });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Add certification details of a registered company  
export const createCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'add-company-certifications',
            text: certificationQuery.addCompanyCertifications,
            values: [_body.companyId, _body.certificationId, _body.certificationNumber, _body.logo, _body.document, currentTime, _body.certificationType],
        }
        const getprofilePercentge = {
            name: 'get-profile-percentge',
            text: certificationQuery.getProfilePercentage,
            values: [_body.companyId],
        }
        database().query(getprofilePercentge, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to fetch profile percentage", data: {} });
                return;
            }
            else {
                const profilePercentage = results.rows[0].profilePercentage
                var count = profilePercentage + 25

            }
            const updateProfile = {
                name: 'profile-percentage-update',
                text: certificationQuery.updateProfilePercentage,
                values: [count, _body.companyId],
            }
            database().query(updateProfile, (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Failed to update profile percentage", data: {} });
                    return;
                }
            })
        })
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification added successfully", data: {} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Update certification details of a registered company  
export const updateCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-company-certifications',
            text: certificationQuery.updateCompanyCertifications,
            values: [_body.companyId, _body.certificationId, _body.certificationNumber, _body.logo, _body.document, currentTime, _body.certificationType, _body.companyCertificationId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification updated successfully", data: {} });
        })
    })
}

 // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Delete certification details of a registered company  
export const deleteCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        console.log(_body.companycertificationId)
        console.log(_body.companyId)
        const query = {
            name: 'delete-company-certification',
            text: certificationQuery.deleteCompanyCertifications,
            values: [currentTime, _body.companycertificationId],
        }
        // const getprofilePercentge = {
        //     name: 'get-profile-percentge',
        //     text: certificationQuery.getProfilePercentage,
        //     values: [_body.companyId],
        // }
        // database().query(getprofilePercentge, (error, results) => {
        //     if (error) {
        //         reject({ code: 400, message: "Failed to fetch profile percentage", data: {} });
        //         return;
        //     }
        //     else {
        //         const profilePercentage = results.rows[0].profilePercentage
        //         var count = profilePercentage - 25

        //     }
        //     const updateProfile = {
        //         name: 'profile-percentage-update',
        //         text: certificationQuery.updateProfilePercentage,
        //         values: [count, _body.companyId],
        //     }
        //     database().query(updateProfile, (error, results) => {
        //         if (error) {
        //             reject({ code: 400, message: "Failed to update profile percentage", data: {} });
        //             return;
        //         }
        //     })
        // })
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification deleted successfully", data: {} });
        })
    })
}