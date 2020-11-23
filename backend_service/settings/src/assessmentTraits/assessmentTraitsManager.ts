import assessmentTraitsQuery from './query/AssessmentTraitsQuery';
import database from '../common/database/database';


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Fetch all the assesment trits from database
export const getAssessmentTraits = () => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-assessment-traits',
            text: assessmentTraitsQuery.getAssessmentTraits,
            values: [],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Assessment Traits listed successfully", data: { assessmentTraits: results.rows } });
        })
    });
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Create a new assesment trait
export const createNewAssessmentTraits = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'create-assessment-traits',
            text: assessmentTraitsQuery.createAssessmentTraits,
            values: [_body.assessmentTraitName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Assessment trait added successfully", data: {} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update assesment traits
export const updateAssessmentTraits = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-assessment-trait',
            text: assessmentTraitsQuery.updateAssessmentTraits,
            values: [_body.assessmentTraitName, currentTime, _body.assessmentTraitId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Assessment trait updated successfully", data: {} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Delete an assesment trait
export const deleteAssessmentTraits = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-assessment',
            text: assessmentTraitsQuery.deleteAssessmentTraits,
            values: [currentTime, _body.assessmentTraitId],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Assessment Traits deleted successfully", data: {} });
        })
    })
}