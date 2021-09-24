export default {
    retrieveUserInfo:'SELECT e.firstname as "firstName",e.lastname as "lastName" ,e.employee_id as "employeeId",e.email as "email",e.account_type as "accountType",p.company_name as "companyName",p.company_website as "companyWebsite",s.company_size as "companySize" FROM employee e INNER JOIN company p ON p.company_id=e.company_id INNER JOIN company_size s ON s.company_size_id=p.company_size_id WHERE e.employee_id=$1',
    listUsers:'SELECT e.firstname as "firstName",e.lastname as "lastName",e.employee_id as "employeeId",e.email as "email",e.telephone_number as "phoneNumber",p.company_logo as "companyLogo",p.company_name as "companyName",p.company_website as "companyWebsite",e.created_on as "dateOfRegistration",e.account_type as "accountType" FROM employee e INNER JOIN company p ON p.company_id=e.company_id WHERE e.status=false AND e.admin_approve_status is NULL',
    listUsersTotalCount:'select count(*) as "totalCount" FROM employee e INNER JOIN company p ON p.company_id=e.company_id WHERE e.status=false AND e.admin_approve_status is NULL',
    // registeredUsersList:'SELECT   e.firstname as "firstName", (select concat(e.firstname, \' \',e.lastname) from employee e where e.employee_id =c.assesed_by)as "assesedBy",e.lastname as "lastName", e.employee_id as "employeeId", e.email as "email", e.admin_approve_status as "adminApproveStatus", e.telephone_number as "phoneNumber", e.account_type as "accountType", c.company_name as "companyName", c.company_website as "companyWebsite" FROM employee e INNER JOIN company c ON c.company_id = e.company_id WHERE e.admin_approve_status IS NOT NULL AND e.account_type=$userstype and c.company_type!=2 and e.user_role_id!=1 and(c.company_name ilike $searchkey)',
    allRegisteredUsersList:'with src as (select distinct on (c.company_id) c.company_id as "companyId", c.company_type, c.company_name as "companyName", e.employee_id as "employeeId", e.admin_approve_status as "adminApproveStatus", (select e1.firstname || \' \' || e1.lastname from employee e1 where e1.employee_id = c.assesed_by) as "assesedBy", e.firstname as "firstName", e.lastname as "lastName", e.email, e.telephone_number as "phoneNumber", e.account_type as "accountType", e.created_on, e.updated_on as "updatedDate" from company c inner join employee e on c.company_id = e.company_id where e.admin_approve_status is not null and company_type != 2 order by c.company_id, e.created_on) select "accountType", "adminApproveStatus", "assesedBy", "companyName", "firstName", "lastName", email, "phoneNumber", "employeeId", "companyId", "updatedDate" from src where "companyName" ilike $searchkey ',
    // registeredUsersListCount:'select count(*) as "totalCount" FROM employee e INNER JOIN company c ON c.company_id = e.company_id WHERE e.admin_approve_status IS NOT NULL AND e.account_type=$userstype and c.company_type!=2',
    allRegisteredUsersListCount:'with src as (select distinct on (c.company_id) c.company_id as "companyId", c.company_type, c.company_name as "companyName", e.employee_id as "employeeId", e.admin_approve_status as "adminApproveStatus", (select e1.firstname || \' \' || e1.lastname from employee e1 where e1.employee_id = c.assesed_by) as "assesedBy", e.firstname as "firstName", e.lastname as "lastName", e.email, e.telephone_number as "phoneNumber", e.account_type as "accountType", e.created_on, e.updated_on as "updatedDate" from company c inner join employee e on c.company_id = e.company_id where e.admin_approve_status is not null and company_type!=2 order by c.company_id, e.created_on) select count(*) as "totalCount" from src where "companyName" ilike $searchkey ',
    subUserClearanceQuery:'UPDATE employee SET status=$2,admin_approve_status=$3,updated_on=$4 WHERE company_id=$1',
    clearanceQuery:'UPDATE employee SET status=$2,admin_approve_status=$3,updated_on=$4 WHERE employee_id=$1 RETURNING firstname,lastname,email,company_id,account_type',
    approveEmployeeQuery:'UPDATE employee SET status= true, admin_approve_status=1, password=$2, updated_on=$3 WHERE employee_id = $1 RETURNING email,firstname,lastname',
    reApproveEmployeeQuery:'UPDATE employee SET status= false, admin_approve_status=1, password=$2, updated_on=$3 WHERE employee_id = $1 RETURNING email,firstname,lastname',
    storePassword:"UPDATE  employee SET password=$1 WHERE email=$2",
    saveRecruiterQuery:'update company set assesed_by=$1 where company_id=$2',
    closeHirerPositions:'update positions set job_status=8 where company_id=$1',
    getCompanyNameQuery:'select c.company_name,c.company_id from company c inner join employee e on e.company_id=c.company_id where e.employee_id=$1',
    getellowAdmins:"select concat(firstname,' ',lastname) as name ,employee_id as employeeId,email as email from employee where status=true and user_role_id=1",
    addNewJobCategory:"INSERT INTO job_category (job_category_name, created_on, updated_on) VALUES ($1, $2, $2) returning job_category_id",
    addNewSkills:"with updated_src as ( with src as ( select (array(select unnest($1::text[]))) as newskill, (array(select skill_name from skills where status = true)) as existingskill ) INSERT INTO skills (skill_name, created_on, updated_on) VALUES (unnest((select array_agg(elem) from src, unnest(newskill) elem where elem not ilike all (existingskill) )), $2, $2) returning skill_id as newskill) select * from updated_src us union select skill_id as newskill from skills s where skill_name ilike any ($1::text[])",
    addJobSkill:"INSERT INTO job_category_skills (job_category_id, skill_id, created_on, updated_on) VALUES ($1, unnest($2::int[]), $3, $3) on conflict on constraint job_category_skills_job_category_id_skill_id_unique_key do nothing ",
    addJobCategoryWithComparison : "with updated_src as (with src as ( select (array(select unnest($1::text[]))) as newjobcategory, (array(select job_category_name from job_category where status = true)) as existingjobcategory ) INSERT INTO job_category (job_category_name, created_on, updated_on) VALUES (unnest( (select array_agg(elem) from src, unnest(newjobcategory) elem where elem not ilike all (existingjobcategory))), $2, $2) returning job_category_id as newjobid,job_category_name as newjobname) select * from updated_src us union select job_category_id as newjobid ,job_category_name as newjobname from job_category s where job_category_name ilike any ($1::text[]) ",
    allSkills:'WITH res AS ( SELECT job_category_name, json_agg(skill_name order by skill_name) as skillname FROM job_category_skills as jcs left join job_category jc on jcs.job_category_id = jc.job_category_id left join skills s on jcs.skill_id = s.skill_id GROUP BY job_category_name order by job_category_name ) SELECT json_object_agg(job_category_name, skillname) as alljobskills FROM res',
    candidatePositionReports:'select count(*) as "NumberOfAppliedJobs", json_agg(json_build_object( \'CandidateName\', ca.candidate_first_name || \' \' || ca.candidate_last_name, \'ProviderCompanyName\', ca_c.company_name, \'PositionName\', p.position_name, \'HirerCompanyName\', p_c.company_name, \'CreatedOn\', cp.created_on ) order by cp.created_on) as "Positions", (select firstname || \' \' || lastname from employee where employee_id = cp.created_by) as "RecruiterName" from candidate_position cp left join positions p on cp.position_id = p.position_id left join candidate ca on cp.candidate_id = ca.candidate_id left join company p_c on p.company_id = p_c.company_id left join company ca_c on ca_c.company_id = ca.company_id where cp.created_by in (select employee_id from employee where user_role_id = 1) ',
    positionReports:'select count(*) as "NumberOfCandidates", json_agg(json_build_object(\'PositionName\', position_name, \'CompanyName\', company_name, \'CreatedOn\', p.created_on ) order by p.created_on) as "Positions", (select firstname || \' \' || lastname from employee where employee_id = p.created_by) as "RecruiterName", case when p.job_status = 5 then \'Draft\' else \'Active\' end as "PositionStatus" from positions p left join company c on p.company_id = c.company_id where p.created_by in (select employee_id from employee where user_role_id = 1)  ',
    candidateReports:'select count(*) as "NumberOfCandidates", json_agg(json_build_object(\'CandidateName\', candidate_first_name || \' \' || candidate_last_name, \'CompanyName\', company_name, \'CreatedOn\', ca.created_on ) order by ca.created_on) as "Candidates", (select firstname || \' \' || lastname from employee where employee_id = ca.created_by) as "RecruiterName", case when ca.candidate_status = 3 then \'Submitted\' else \'Not submitted\' end as "CandidateStatus" from candidate ca left join company c on ca.company_id = c.company_id where ca.created_by in (select employee_id from employee where user_role_id = 1)  ',
    registrationReports:'with src as (select distinct on (c.company_id) c.company_id as "companyId", c.company_type, c.company_name as "companyName", e.employee_id as "employeeId", e.admin_approve_status as "adminApproveStatus", (select e1.firstname || \' \' || e1.lastname from employee e1 where e1.employee_id = c.assesed_by) as "assesedBy", e.firstname as "firstName", e.lastname as "lastName", e.email, e.telephone_number as "phoneNumber", e.account_type as "accountType", e.user_role_id as "userRoleId", e.created_on, e.updated_on as "updatedDate" from company c inner join employee e on c.company_id = e.company_id where company_type != 2 order by c.company_id, e.created_on) select count(*), "assesedBy", case when "adminApproveStatus" = 1 then \'Approved\' else case when "adminApproveStatus" = 0 then \'Rejected\' else \'Pending\' end end as "status", json_agg(json_build_object(\'CompanyName\', "companyName", \'Email\', email, \'UserName\', "firstName" || \' \' || "lastName", \'UpdatedDate\', "updatedDate", \'AccountType\', case when "userRoleId" = 1 then \'Admin\' else case when "userRoleId" = 2 then \'Hirer\' else case when "userRoleId" = 3 then \'Provider\' else case when "userRoleId" = 4 then \'Freelancer\' else case when "userRoleId" is null then \'Unassigned\' end end end end end)order by "updatedDate") as "employeeData" from src ',
    freelancerReports:'select json_agg( json_build_object(\'candidateName\', initcap(candidate_first_name || \' \' || candidate_last_name), \'resume\', resume, \'email\', email_address, \'createdOn\', created_on) order by created_on) as "candidateDetails", case when candidate_status = 3 then \'Submitted\' else \'Not Submitted\' end as "candidateStatus", case when allocated_to is not null then (select initcap(firstname || \' \' || employee.lastname) from employee where employee_id = allocated_to) else \'Not Allocated\' end as "RecruiterName", count(*) as "numberOfCandidates" from candidate c where c.company_id in (select company_id from company where company_type = 2)  ',
    deleteJobCategory:'delete from job_category where job_category_id=$1',
    getJobCategoryCandidateLinks:'select candidate_id as "candidateId", (candidate_first_name || \' \' || candidate_last_name) as "fullName", co.company_name as "companyName", ca.created_on as "createdOn", availability, (e.firstname || \' \' || e.lastname) as "createdBy" from candidate ca left join company co on ca.company_id = co.company_id left join employee e on ca.created_by = e.employee_id where job_category_id = $1 order by candidate_first_name;',
    getJobCategoryPositionLinks:'select position_id as "positionId", position_name as "positionName", company_name as "companyName", (case when job_status = 5 then \'Draft\' else case when job_status = 6 then \'Active\' else case when job_status = 8 then \'Closed\' end end end) as "activeStatus", p.created_on as "createdOn", (e.firstname || \' \' || e.lastname) as "createdBy" from positions p left join company c on p.company_id = c.company_id left join employee e on p.created_by = e.employee_id where job_category_id = $1 order by position_name;',
    editJobCategory:'update job_category set job_category_name = $2,updated_on=$3 where job_category_id=$1',
    removeSkillsFromJobCategory:'delete from job_category_skills where job_category_id = $id and skill_id = any($skill::integer[])',
    removeSkill:'delete from skills where skill_id = $1',
    getSkillCandidateLinks:'select cs.candidate_id as "candidateId", (candidate_first_name || \' \' || candidate_last_name) as "fullName", co.company_name as "companyName", ca.created_on as "createdOn", availability, (e.firstname || \' \' || e.lastname) as "createdBy", s.skill_name from candidate_skill cs left join candidate ca on cs.candidate_id = ca.candidate_id left join company co on ca.company_id = co.company_id left join employee e on ca.created_by = e.employee_id left join skills s on cs.skill_id = s.skill_id where cs.skill_id = $1 order by candidate_first_name;',
    getSkillPositionLinks:'select p.position_id as "positionId", position_name as "positionName", company_name as "companyName", (case when job_status = 5 then \'Draft\' else case when job_status = 6 then \'Active\' else case when job_status = 8 then \'Closed\' end end end) as "activeStatus", p.created_on as "createdOn", (e.firstname || \' \' || e.lastname) as "createdBy", skill_name as "skillName" from job_skills js left join positions p on p.position_id = js.position_id left join company c on p.company_id = c.company_id left join employee e on p.created_by = e.employee_id left join skills s on js.skill_id = s.skill_id where js.skill_id = $1 order by position_name;',
    editSkill:'update skills set skill_name=$2,updated_on=$3 where skill_id=$1 ',
    removeResource:'with src as ( delete from candidate where candidate_id = $1 returning candidate_id ), src2 as ( delete from candidate_employee where candidate_id = (select src.candidate_id from src) returning employee_id ) delete from employee where employee_id = (select src2.employee_id from src2)',
    getResourcePositionLinks:'select "candidateId", initcap("candidateFirstName"||\' \'||"candidateLastName"), "positionId", "positionName", "positionStatusName", "hirerCompanyName" from candidate_hiring_steps_view where "candidateId" = $1 and "positionId" is not null;',
}
