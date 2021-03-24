export default {
    retrieveUserInfo:'SELECT e.firstname as "firstName",e.lastname as "lastName" ,e.employee_id as "employeeId",e.email as "email",e.account_type as "accountType",p.company_name as "companyName",p.company_website as "companyWebsite",s.company_size as "companySize" FROM employee e INNER JOIN company p ON p.company_id=e.company_id INNER JOIN company_size s ON s.company_size_id=p.company_size_id WHERE e.employee_id=$1',
    listUsers:'SELECT e.firstname as "firstName",e.lastname as "lastName",e.employee_id as "employeeId",e.email as "email",e.telephone_number as "phoneNumber",p.company_logo as "companyLogo",p.company_name as "companyName",p.company_website as "companyWebsite" FROM employee e INNER JOIN company p ON p.company_id=e.company_id WHERE e.status=false AND e.admin_approve_status is NULL',
    listUsersTotalCount:'select count(*) as "totalCount" FROM employee e INNER JOIN company p ON p.company_id=e.company_id WHERE e.status=false AND e.admin_approve_status is NULL',
    registeredUsersList:'SELECT e.firstname as "firstName", e.lastname as "lastName", e.employee_id as "employeeId", e.email as "email", e.admin_approve_status as "adminApproveStatus", e.telephone_number as "phoneNumber", e.account_type as "accountType", c.company_name as "companyName", c.company_website as "companyWebsite" FROM employee e INNER JOIN company c ON c.company_id = e.company_id WHERE e.admin_approve_status IS NOT NULL AND e.account_type=$userstype and c.company_type!=2 and e.user_role_id!=1 and(c.company_name ilike $searchkey)',
    allRegisteredUsersList:'SELECT e.firstname as "firstName", e.lastname as "lastName", e.employee_id as "employeeId", e.email as "email", e.admin_approve_status as "adminApproveStatus", e.telephone_number as "phoneNumber", e.account_type as "accountType", c.company_name as "companyName", c.company_website as "companyWebsite" FROM employee e INNER JOIN company c ON c.company_id = e.company_id WHERE e.admin_approve_status IS NOT NULL AND  c.company_type!=2 AND(c.company_name ILIKE $searchkey)',
    registeredUsersListCount:'select count(*) as "totalCount" FROM employee e INNER JOIN company c ON c.company_id = e.company_id WHERE e.admin_approve_status IS NOT NULL AND e.account_type=$userstype and c.company_type!=2',
    allRegisteredUsersListCount:'select count(*) as "totalCount" FROM employee e INNER JOIN company c ON c.company_id = e.company_id WHERE e.admin_approve_status IS NOT NULL AND c.company_type!=2',
    clearanceQuery:'UPDATE employee SET status=$2,admin_approve_status=$3,updated_on=$4 WHERE employee_id=$1 RETURNING firstname,lastname,email',
    approveEmployeeQuery:'UPDATE employee SET status= true, admin_approve_status=1, password=$2, updated_on=$3 WHERE employee_id = $1 RETURNING email,firstname,lastname',
    storePassword:"UPDATE  employee SET password=$1 WHERE email=$2",
    getCompanyNameQuery:'select c.company_name from company c inner join employee e on e.company_id=c.company_id where e.employee_id=$1',
    getellowAdmins:"select concat(firstname,' ',lastname) as name ,employee_id as employeeId,email as email from employee where status=true and user_role_id=1",
    addNewJobCategory:"INSERT INTO job_category (job_category_name, created_on, updated_on) VALUES ($1, $2, $2) returning job_category_id",
    addNewSkills:"with updated_src as ( with src as ( select (array(select unnest($1::text[]))) as newskill, (array(select skill_name from skills where status = true)) as existingskill ) INSERT INTO skills (skill_name, created_on, updated_on) VALUES (unnest((select array_agg(elem) from src, unnest(newskill) elem where elem not ilike all (existingskill) )), $2, $2) returning skill_id as newskill) select * from updated_src us union select skill_id as newskill from skills s where skill_name ilike any ($1::text[])",
    addJobSkill:"INSERT INTO job_category_skills (job_category_id, skill_id, created_on, updated_on) VALUES ($1, unnest($2::int[]), $3, $3) on conflict on constraint job_category_skills_job_category_id_skill_id_unique_key do nothing ",
    addJobCategoryWithComparison : "with updated_src as (with src as ( select (array(select unnest($1::text[]))) as newjobcategory, (array(select job_category_name from job_category where status = true)) as existingjobcategory ) INSERT INTO job_category (job_category_name, created_on, updated_on) VALUES (unnest( (select array_agg(elem) from src, unnest(newjobcategory) elem where elem not ilike all (existingjobcategory))), $2, $2) returning job_category_id as newjobid,job_category_name as newjobname) select * from updated_src us union select job_category_id as newjobid ,job_category_name as newjobname from job_category s where job_category_name ilike any ($1::text[]) "
}
