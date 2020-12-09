import CloudProficiencyQuery from './query/CloudProficiencyQuery';
import database from '../common/database/database';


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Fetch all cloud proficiency lists from database
export const fetchCloudProficiency = () => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-cloud-proficiencys',
            text: CloudProficiencyQuery.fetchCloudProficiency,
            values: [],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Cloud Proficiency listed successfully", data: { cloudProficiency: results.rows } });
        })
    });
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Create a new cloud proficiency
export const createNewCloudProficiency = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'create-cloud-proficiency',
            text: CloudProficiencyQuery.createNewCloudProficiency,
            values: [_body.cloudProficiencyName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Cloud Proficiency created successfully", data: {} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update cloud proficiency details
export const modifyCloudProficiency = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-cloud-proficiency',
            text: CloudProficiencyQuery.modifyCloudProficiency,
            values: [_body.cloudProficiencyId,_body.cloudProficiencyName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Cloud Proficiency updated successfully", data: {} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Remove cloud proficiency from database
export const removeCloudProficiency = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-cloud-proficiency',
            text: CloudProficiencyQuery.removeCloudProficiency,
            values: [_body.cloudProficiencyId,currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Cloud Proficiency deleted successfully", data: {} });
        })
    })
}