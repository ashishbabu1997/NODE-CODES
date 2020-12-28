import jobQuery from './query/jobCategoryQuery';
import database from '../common/database/database';


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>List all job categories from database
export const listJobCategories = () => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'list-job-categories',
            text: jobQuery.getJobCategoryList,
            values: [],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Job Categories listed successfully", data: { jobCategories: results.rows } });
        })
    });
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Create a new job category
export const createNewJobCategory = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'create-new-job-category',
            text: jobQuery.createNewJobCategory,
            values: [_body.jobCategoryName,currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            var jobId=results.rows[0].job_category_id
            resolve({ code: 200, message: "Job Category created successfully", data: {jobCategoryId:jobId} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update job category details 
export const updateJobCategory= (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-job-category',
            text: jobQuery.updateJobCategory,
            values: [_body.jobCategoryName, currentTime, _body.jobCategoryId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Job Category updated successfully", data: {} });
        })
    })
}



 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Delete job category details 
export const deleteJobCategory = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-job-category',
            text: jobQuery.deleteJobCategory,
            values: [currentTime, _body.jobCategoryId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Job Category deleted successfully", data: {} });
        })
    })
}