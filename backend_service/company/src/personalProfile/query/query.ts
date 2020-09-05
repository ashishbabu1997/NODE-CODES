export default {
    getProfiles: 'SELECT c.company_name as "companyName",c.company_description as "description",s.service_name as "serviceName" FROM company c INNER JOIN services s ON s.service_id=$2 WHERE c.company_id=$1 '
    // getSkills:'SELECT s.skill_name FROM skills s INNER JOIN job_cateogory '
}