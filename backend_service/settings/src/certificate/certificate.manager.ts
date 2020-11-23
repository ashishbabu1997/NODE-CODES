import certificateQuery from './query/certificate.query';
import database from '../common/database/database';


 // >>>>>>> FUNC. >>>>>>>  
//>>>>>>>>>>>>>>>>>>Get all certifications list from database
export const getCertificates = (_body) => {
    return new Promise((resolve, reject) => {
    const query = {
            name: 'fetch-certificates',
            text: certificateQuery.getCertificate
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certificates listed successfully", data: { certificates: results.rows } });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Create a new certification
export const createCertificate = (_body) => {
    return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const query = {
            name: 'add-certificate',
            text: certificateQuery.addCertificate,
            values: [_body.certificationName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Certification added successfully", data: {} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update certifications
export const updateCertificate = (_body) => {
    return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const query = {
            name: 'update-certificate',
            text: certificateQuery.updateCertificate,
            values: [_body.certificationName, currentTime, _body.certificationId]
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
//>>>>>>>>>>>>>>>>>>Delete certifications
export const deleteCertificate = (_body) => {
    return new Promise((resolve, reject) => {
    const query = {
            name: 'delete-certificate',
            text: certificateQuery.deleteCertificate,
            values: [_body.certificationId]
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
