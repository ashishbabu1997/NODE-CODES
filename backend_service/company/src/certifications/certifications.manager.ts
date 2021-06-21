import certificationQuery from './query/certification.query';
import database from '../common/database/database';


 // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Fetch certifications updated by a company  
export const fetchCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
        _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;
        
        const query = {
            name: 'fetch-company-Certifications',
            text: certificationQuery.getCompanyCertifications,
            values: [parseInt(_body.userCompanyId)]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
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
        const currentTime = Math.floor(Date.now());
        _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

        const query = {
            name: 'add-company-certifications',
            text: certificationQuery.addCompanyCertifications,
            values: [_body.userCompanyId, _body.certificationId, _body.certificationNumber, _body.logo, _body.document, currentTime, _body.certificationType],
        }
        const getprofilePercentge = {
            name: 'get-profile-percentge',
            text: certificationQuery.getProfilePercentage,
            values: [_body.userCompanyId],
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
                values: [count, _body.userCompanyId],
            }
            database().query(updateProfile, (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Failed to update profile percentage", data: error.message });
                    return;
                }
            })
        })
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
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
        _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

        const currentTime = Math.floor(Date.now());
        const query = {
            name: 'update-company-certifications',
            text: certificationQuery.updateCompanyCertifications,
            values: [_body.userCompanyId, _body.certificationId, _body.certificationNumber, _body.logo, _body.document, currentTime, _body.certificationType, _body.companyCertificationId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
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
        const query = {
            name: 'delete-company-certification',
            text: certificationQuery.deleteCompanyCertifications,
            values: [_body.companyCertificationId],
        }
        database().query(query, (error) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Certification deleted successfully", data: {} });
        })
    })
}