import certificationQuery from './query/certification.query';
import database from '../common/database/database';

export const fetchCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
    const query = {
            name: 'fetch-company-Certifications',
            text: certificationQuery.getCompanyCertifications,
            values: [parseInt(_body.companyId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certifications listed successfully", data: { certifications: results.rows } });
        })
    })
}

export const createCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const query = {
            name: 'add-company-certifications',
            text: certificationQuery.addCompanyCertifications,
            values: [_body.companyId, _body.certificateId, _body.certificateNumber, _body.logo, _body.document, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification added successfully", data: {} });
        })
    })
}


export const updateCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const query = {
            name: 'update-company-certifications',
            text: certificationQuery.updateCompanyCertifications,
            values: [_body.companyId, _body.certificateId, _body.certificateNumber, _body.logo, _body.document, currentTime, _body.companyCertificateId]
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

export const deleteCompanyCertifications = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-company-certification',
            text: certificationQuery.deleteCompanyCertifications,
            values: [currentTime, parseInt(_body.companycertificationId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification deleted successfully", data: {} });
        })
    })
}