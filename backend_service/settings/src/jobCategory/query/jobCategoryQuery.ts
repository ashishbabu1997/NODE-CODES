export default {
    getJobCategoryList: `select job_category_id as "jobCategoryId", job_category_name as "jobCategoryName" from  job_category where status = true`,
    createNewJobCategory: "INSERT into job_category (job_category_name,created_on ,updated_on ) values ($1 ,$2,$2 ) RETURNING job_category_id",
    updateJobCategory: `update job_category set job_category_name = $1, updated_on = $2 where job_category_id = $3 and status = true`,
    deleteJobCategory: `update job_category set status = false,updated_on = $1 where job_category_id = $2`
}