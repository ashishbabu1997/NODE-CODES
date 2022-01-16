export default {
  retrieveUserInfo:
    'SELECT e.firstname as "firstName",e.lastname as "lastName" ,e.employee_id as "employeeId",e.email as "email",e.account_type as "accountType",p.company_name as "companyName",p.company_website as "companyWebsite",s.company_size as "companySize" FROM employee e INNER JOIN company p ON p.company_id=e.company_id INNER JOIN company_size s ON s.company_size_id=p.company_size_id WHERE e.employee_id=$1',
  listUsers:
    'SELECT e.firstname as "firstName",e.lastname as "lastName",e.employee_id as "employeeId",e.email as "email",e.telephone_number as "phoneNumber",p.company_logo as "companyLogo",p.company_name as "companyName",p.company_website as "companyWebsite",e.created_on as "dateOfRegistration",e.account_type as "accountType" FROM employee e INNER JOIN company p ON p.company_id=e.company_id WHERE e.status=false AND e.admin_approve_status is NULL',
  listUsersTotalCount: 'select count(*) as "totalCount" FROM employee e INNER JOIN company p ON p.company_id=e.company_id WHERE e.status=false AND e.admin_approve_status is NULL',
  allRegisteredUsersList:
    'with src as (select distinct on (c.company_id) c.company_id as "companyId", c.company_type as "companyType",c.created_on as "createdDate", c.company_name as "companyName", e.employee_id as "employeeId", e.admin_approve_status as "adminApproveStatus", (select e1.firstname || \' \' || e1.lastname from employee e1 where e1.employee_id = c.assesed_by) as "assesedBy", ( select json_agg( json_build_object(\'firstName\', e.firstname, \'lastName\', e.lastname, \'email\', e.email, \'phoneNumber\', e.telephone_number, \'accountType\', e.account_type, \'createdDate\', e.created_on, \'updatedDate\', e.updated_on )) from employee e where e.company_id=c.company_id and e.primary_email=true) as "employees" from company c inner join employee e on c.company_id = e.company_id where e.admin_approve_status is not null and company_type not in (2,0) order by c.company_id, e.created_on) select "companyType", "adminApproveStatus", "assesedBy", "employees", "companyName", "employeeId", "companyId" from src where "companyName" ilike $searchkey',
  allRegisteredUsersListCount:
    'with src as (select distinct on (c.company_id) c.company_id as "companyId", c.company_type, c.company_name as "companyName", e.employee_id as "employeeId", e.admin_approve_status as "adminApproveStatus", (select e1.firstname || \' \' || e1.lastname from employee e1 where e1.employee_id = c.assesed_by) as "assesedBy", e.firstname as "firstName", e.lastname as "lastName", e.email, e.telephone_number as "phoneNumber", e.account_type as "accountType", e.created_on, e.updated_on as "updatedDate" from company c inner join employee e on c.company_id = e.company_id where e.admin_approve_status is not null and company_type!=2 order by c.company_id, e.created_on) select count(*) as "totalCount" from src where "companyName" ilike $searchkey ',
  subUserClearanceQuery: 'UPDATE employee SET status=$2,admin_approve_status=$3,updated_on=$4 WHERE company_id=$1',
  clearanceQuery: 'UPDATE employee SET status=$2,admin_approve_status=$3,updated_on=$4 WHERE employee_id=$1 RETURNING firstname,lastname,email,company_id,account_type',
  approveEmployeeQuery: 'UPDATE employee SET status= true, admin_approve_status=1, password=$2, updated_on=$3 WHERE employee_id = $1 RETURNING email,firstname,lastname',
  reApproveEmployeeQuery: 'UPDATE employee SET status= false, admin_approve_status=1, password=$2, updated_on=$3 WHERE employee_id = $1 RETURNING email,firstname,lastname',
  storePassword: 'UPDATE  employee SET password=$1 WHERE email=$2',
  saveRecruiterQuery: 'update company set assesed_by=$1 where company_id=$2',
  closeHirerPositions: 'update positions set job_status=8 where company_id=$1',
  getCompanyNameQuery: 'select c.company_name,c.company_id from company c inner join employee e on e.company_id=c.company_id where e.employee_id=$1',
  getellowAdmins: "select concat(firstname,' ',lastname) as name ,employee_id as employeeId,email as email from employee where status=true and user_role_id=1",
  addNewJobCategory: 'INSERT INTO job_category (job_category_name, created_on, updated_on) VALUES ($1, $2, $2) returning job_category_id',
  addNewSkills:
    'with updated_src as ( with src as ( select (array(select unnest($1::text[]))) as newskill, (array(select skill_name from skills where status = true)) as existingskill ) INSERT INTO skills (skill_name, created_on, updated_on) VALUES (unnest((select array_agg(elem) from src, unnest(newskill) elem where elem not ilike all (existingskill) )), $2, $2) returning skill_id as newskill) select * from updated_src us union select skill_id as newskill from skills s where skill_name ilike any ($1::text[])',
  addJobSkill:
    'INSERT INTO job_category_skills (job_category_id, skill_id, created_on, updated_on) VALUES ($1, unnest($2::int[]), $3, $3) on conflict on constraint job_category_skills_job_category_id_skill_id_unique_key do nothing ',
  addJobCategoryWithComparison:
    'with updated_src as (with src as ( select (array(select unnest($1::text[]))) as newjobcategory, (array(select job_category_name from job_category where status = true)) as existingjobcategory ) INSERT INTO job_category (job_category_name, created_on, updated_on) VALUES (unnest( (select array_agg(elem) from src, unnest(newjobcategory) elem where elem not ilike all (existingjobcategory))), $2, $2) returning job_category_id as newjobid,job_category_name as newjobname) select * from updated_src us union select job_category_id as newjobid ,job_category_name as newjobname from job_category s where job_category_name ilike any ($1::text[]) ',
  allSkills:
    'WITH res AS ( SELECT job_category_name, json_agg(skill_name order by skill_name) as skillname FROM job_category_skills as jcs left join job_category jc on jcs.job_category_id = jc.job_category_id left join skills s on jcs.skill_id = s.skill_id GROUP BY job_category_name order by job_category_name ) SELECT json_object_agg(job_category_name, skillname) as alljobskills FROM res',
  candidatePositionReports:
    "SELECT COUNT(*) AS \"NumberOfAppliedJobs\", JSON_AGG(JSON_BUILD_OBJECT( 'PositionId', p.position_id, 'CandidateId', ca.candidate_id, 'CandidateName', ca.candidate_first_name || ' ' || ca.candidate_last_name, 'ProviderCompanyName', ca_c.company_name, 'PositionName', p.position_name, 'HirerCompanyName', p_c.company_name, 'CreatedOn', cp.created_on, 'PositionStatusName', ( SELECT COALESCE(\"positionStatusName\", 'Submitted') FROM candidate_hiring_steps_view WHERE \"candidateId\" = ca.candidate_id AND \"positionId\" = p.position_id ) ) ORDER BY cp.created_on) AS \"Positions\", (SELECT firstname || ' ' || lastname FROM employee WHERE employee_id = cp.created_by) AS \"RecruiterName\" FROM candidate_position cp LEFT JOIN positions p ON cp.position_id = p.position_id LEFT JOIN candidate ca ON cp.candidate_id = ca.candidate_id LEFT JOIN company p_c ON p.company_id = p_c.company_id LEFT JOIN company ca_c ON ca_c.company_id = ca.company_id WHERE cp.created_by IN (SELECT employee_id FROM employee WHERE user_role_id = 1) ",
  positionReports:
    "SELECT COUNT(*) AS \"NumberOfCandidates\", JSON_AGG( JSON_BUILD_OBJECT('PositionName', position_name, 'CompanyName', company_name, 'CreatedOn', p.created_on, 'JobType', p.type_of_job, 'Experience', p.experience_level, 'ContractStartDate', p.contract_start_date, 'ContractDuration', p.contract_duration, 'ContractPeriod', p.contract_period, 'JobCategory', p.job_category_id, 'ResourceCount', p.developer_count, 'Skills', ( SELECT JSON_AGG( JSON_BUILD_OBJECT('skillId', js.skill_id, 'skillName', s.skill_name, 'topRatedSkill', s.top_rated )) FROM job_skills js LEFT JOIN skills s ON s.skill_id = js.skill_id WHERE js.position_id = p.position_id AND js.status = TRUE ), 'Profiles', (SELECT JSON_AGG(counts) FROM (SELECT COALESCE(\"positionStatusName\", 'Submitted') AS \"positionStatusName\", COUNT(\"positionId\") FROM candidate_hiring_steps_view WHERE \"positionId\" = p.position_id GROUP BY \"positionStatusName\") AS counts) ) ORDER BY p.created_on) AS \"Positions\", (SELECT firstname || ' ' || lastname FROM employee WHERE employee_id = p.created_by) AS \"RecruiterName\", CASE WHEN p.job_status = 5 THEN 'Draft' ELSE 'Active' END AS \"PositionStatus\" FROM positions p LEFT JOIN company c ON p.company_id = c.company_id WHERE p.created_by IN (SELECT employee_id FROM employee WHERE user_role_id = 1) ",
  candidateReports:
    "SELECT COUNT(*) AS \"NumberOfCandidates\", JSON_AGG( JSON_BUILD_OBJECT('CandidateName', candidate_first_name || ' ' || candidate_last_name, 'CompanyName', company_name, 'CreatedOn', ca.created_on, 'EllowStatus', ers.status_name, 'Email', ca.email_address, 'Positions', ( SELECT JSON_AGG(JSON_BUILD_OBJECT('positionId', \"positionId\", 'positionName', \"positionName\", 'positionStatusName', \"positionStatusName\", 'hirerCompanyName', \"hirerCompanyName\")) FROM candidate_hiring_steps_view chsv WHERE \"pStatus\" = TRUE AND chsv.\"candidateId\" = ca.candidate_id),'skills',(SELECT JSON_AGG(JSON_BUILD_OBJECT('skillId',sk.skill_id, 'skillName', sk.skill_name)) FROM candidate_skill csk left join skills sk on sk.skill_id=csk.skill_id WHERE csk.candidate_id = ca.candidate_id and csk.preferred=true) ) ORDER BY ca.created_on) AS \"Candidates\", (SELECT firstname || ' ' || lastname FROM employee WHERE employee_id = ca.created_by) AS \"RecruiterName\", CASE WHEN ca.candidate_status = 3 THEN 'Submitted' ELSE 'Not submitted' END AS \"CandidateStatus\" FROM candidate ca LEFT JOIN company c ON ca.company_id = c.company_id LEFT JOIN ellow_recuitment_status ers ON ca.ellow_status_id = ers.ellow_recuitment_status_id WHERE ca.created_by IN (SELECT employee_id FROM employee WHERE user_role_id = 1)",
  registrationReports:
    'with src as (select distinct on (c.company_id) c.company_id as "companyId", c.company_type, c.company_name as "companyName", e.employee_id as "employeeId", e.admin_approve_status as "adminApproveStatus", (select e1.firstname || \' \' || e1.lastname from employee e1 where e1.employee_id = c.assesed_by) as "assesedBy", e.firstname as "firstName", e.lastname as "lastName", e.email, e.telephone_number as "phoneNumber", e.account_type as "accountType", e.user_role_id as "userRoleId", e.created_on, e.updated_on as "updatedDate" from company c inner join employee e on c.company_id = e.company_id where company_type != 2 order by c.company_id, e.created_on) select count(*), "assesedBy", case when "adminApproveStatus" = 1 then \'Approved\' else case when "adminApproveStatus" = 0 then \'Rejected\' else \'Pending\' end end as "status", json_agg(json_build_object(\'CompanyName\', "companyName", \'Email\', email, \'UserName\', "firstName" || \' \' || "lastName", \'UpdatedDate\', "updatedDate", \'AccountType\', case when "userRoleId" = 1 then \'Admin\' else case when "userRoleId" = 2 then \'Hirer\' else case when "userRoleId" = 3 then \'Provider\' else case when "userRoleId" = 4 then \'Freelancer\' else case when "userRoleId" is null then \'Unassigned\' end end end end end)order by "updatedDate") as "employeeData" from src ',
  freelancerReports:
    "SELECT JSON_AGG(JSON_BUILD_OBJECT('candidateName', INITCAP(candidate_first_name || ' ' || candidate_last_name), 'email', c.email_address, 'allocatedTo', (select initcap(firstname || ' ' || lastname) from employee where employee_id = c.allocated_to), 'resume', resume, 'phoneNumber', c.phone_number, 'candidateStatus', c.candidate_status, 'experience', c.work_experience, 'email', email_address, 'createdOn', created_on, 'positions', (SELECT JSON_AGG(JSON_BUILD_OBJECT('positionId', \"positionId\", 'positionName', \"positionName\", 'positionStatusName', \"positionStatusName\", 'hirerCompanyName', \"hirerCompanyName\", 'hirerCompanyId', \"hirerCompanyId\")) FROM candidate_hiring_steps_view chsv WHERE \"candidateId\" = c.candidate_id AND \"pStatus\" = TRUE),'skills',(SELECT JSON_AGG(JSON_BUILD_OBJECT('skillId',sk.skill_id, 'skillName', sk.skill_name)) FROM candidate_skill csk left join skills sk on sk.skill_id=csk.skill_id WHERE csk.candidate_id = c.candidate_id and csk.preferred=true)) ORDER BY created_on) AS \"candidateDetails\", COALESCE(ers.status_name, 'Registered') AS \"stageStatusName\", COUNT(*) AS \"numberOfCandidates\" FROM candidate c LEFT JOIN ellow_recuitment_status ers ON c.ellow_status_id = ers.ellow_recuitment_status_id WHERE c.company_id IN (SELECT company_id FROM company WHERE company_type = 2)",
  hirerCompanyReports:
    'SELECT c.company_id "companyId", c.company_name "companyName", c.created_on "createdOn", (SELECT JSON_AGG(pos) FROM (SELECT CASE WHEN p.job_status = 6 THEN \'Active\' ELSE CASE WHEN p.job_status = 8 THEN \'Closed\' ELSE \'Draft\' END END AS "positionStatus", (SELECT JSON_AGG( JSON_BUILD_OBJECT(\'positionName\', p.position_name, \'createdOn\', p.created_on, \'jobType\', p.type_of_job, \'duration\', p.contract_duration, \'contractStartDate\', p.contract_start_date, \'resourceCount\', p.developer_count, \'positionId\', p.position_id, \'skills\', ( SELECT JSON_AGG(skill) FROM (SELECT skill_name, s.skill_id, js.top_rated_skill FROM job_skills js LEFT JOIN skills s ON js.skill_id = s.skill_id WHERE js.position_id = p.position_id ) AS skill ), \'createdBy\', (SELECT INITCAP(firstname || \' \' || lastname) FROM employee WHERE employee_id = p.created_by), \'profiles\', ( SELECT JSON_AGG("statusName") FROM (SELECT COALESCE("positionStatusName", \'Submitted\') "positionStatusName", COUNT("positionId") AS "count" FROM candidate_hiring_steps_view chsv WHERE chsv."positionId" = p.position_id GROUP BY "positionStatusName") AS "statusName" ) ) )) "positionDetails", COUNT(p.position_id) FROM positions p WHERE p.company_id = c.company_id GROUP BY p.job_status) AS "pos") "positions" FROM company c LEFT JOIN employee e ON c.company_id = e.company_id WHERE e.user_role_id = 2 AND e.primary_email = TRUE ',
  companyBasedPositionReports:
  'select company.company_name as "companyName", company.company_id as "companyId", (select sum(developer_count) from positions where company_id = company.company_id) as "totalPositions", (select sum(developer_count-close_count) from positions where company_id = company.company_id group by company.company_id) as "activePositions", (select sum(close_count) from positions where company_id = company.company_id group by company.company_id) as "closedPositions" from company left join employee e on company.company_id = e.company_id where e.account_type=1 and e.primary_email=true order by company.company_id desc',
  skillBasedPositionsReports:
  'select s.skill_id as "skillId", s.skill_name as "skillName", (select sum(p.developer_count) from positions p left join job_skills js on p.position_id = js.position_id where js.skill_id = s.skill_id and p.job_status = 6 and js.top_rated_skill = true and p.created_on between $fromdate and $todate ) as "totalPositions", (select sum(p.close_count) from positions p left join job_skills js on p.position_id = js.position_id where js.skill_id = s.skill_id and p.job_status = 6 and js.top_rated_skill = true and p.created_on between $fromdate and $todate ) as "closedPositions", ( select sum(p.developer_count-p.close_count) from positions p left join job_skills js on p.position_id = js.position_id where js.skill_id = s.skill_id and p.job_status = 6 and js.top_rated_skill = true and p.created_on between $fromdate and $todate ) as "activePositions" from skills s',
  skillBasedCandidateReports:
  'select s.skill_id as "skillId", s.skill_name as "skillName", (select count(*) from candidate c left join candidate_skill cs on cs.candidate_id = c.candidate_id where cs.skill_id = s.skill_id and c.candidate_vetted = 6 and c.blacklisted = false) as "totalResources", (select count(*) from candidate c left join candidate_skill cs on cs.candidate_id = c.candidate_id where cs.skill_id = s.skill_id and c.candidate_vetted = 6 and c.blacklisted = false and c.candidate_id not in (select candidate_id from candidate_contract_details where in_contract=true)) as "activeResources", (select count(*) from candidate c left join candidate_skill cs on cs.candidate_id = c.candidate_id left join candidate_contract_details ccd on ccd.candidate_id = c.candidate_id where cs.skill_id = s.skill_id and c.candidate_vetted = 6 and c.blacklisted = false and ccd.in_contract = true and c.created_on between $fromdate and $todate ) as "activeIncontract" from skills s',  
  deleteJobCategory: 'delete from job_category where job_category_id=$1',
  getJobCategoryCandidateLinks:
    'select candidate_id as "candidateId", (candidate_first_name || \' \' || candidate_last_name) as "fullName", co.company_name as "companyName", ca.created_on as "createdOn", availability, (e.firstname || \' \' || e.lastname) as "createdBy" from candidate ca left join company co on ca.company_id = co.company_id left join employee e on ca.created_by = e.employee_id where job_category_id = $1 order by candidate_first_name;',
  getJobCategoryPositionLinks:
    'select position_id as "positionId", position_name as "positionName", company_name as "companyName", (case when job_status = 5 then \'Draft\' else case when job_status = 6 then \'Active\' else case when job_status = 8 then \'Closed\' end end end) as "activeStatus", p.created_on as "createdOn", (e.firstname || \' \' || e.lastname) as "createdBy" from positions p left join company c on p.company_id = c.company_id left join employee e on p.created_by = e.employee_id where job_category_id = $1 order by position_name;',
  editJobCategory: 'update job_category set job_category_name = $2,updated_on=$3 where job_category_id=$1',
  removeSkillsFromJobCategory: 'delete from job_category_skills where job_category_id = $id and skill_id = any($skill::integer[])',
  removeSkill: 'delete from skills where skill_id = $1',
  getSkillCandidateLinks:
    'select cs.candidate_id as "candidateId", (candidate_first_name || \' \' || candidate_last_name) as "fullName", co.company_name as "companyName", ca.created_on as "createdOn", availability, (e.firstname || \' \' || e.lastname) as "createdBy", s.skill_name from candidate_skill cs left join candidate ca on cs.candidate_id = ca.candidate_id left join company co on ca.company_id = co.company_id left join employee e on ca.created_by = e.employee_id left join skills s on cs.skill_id = s.skill_id where cs.skill_id = $1 order by candidate_first_name;',
  getSkillPositionLinks:
    'select p.position_id as "positionId", position_name as "positionName", company_name as "companyName", (case when job_status = 5 then \'Draft\' else case when job_status = 6 then \'Active\' else case when job_status = 8 then \'Closed\' end end end) as "activeStatus", p.created_on as "createdOn", (e.firstname || \' \' || e.lastname) as "createdBy", skill_name as "skillName" from job_skills js left join positions p on p.position_id = js.position_id left join company c on p.company_id = c.company_id left join employee e on p.created_by = e.employee_id left join skills s on js.skill_id = s.skill_id where js.skill_id = $1 order by position_name;',
  editSkill: 'update skills set skill_name=$2,updated_on=$3 where skill_id=$1 ',
  removeResource:
    'with src as ( delete from candidate where candidate_id = $1 returning candidate_id ), src2 as ( delete from candidate_employee where candidate_id = (select src.candidate_id from src) returning employee_id ) delete from employee where employee_id = (select src2.employee_id from src2)',
  getResourcePositionLinks:
    'select "candidateId", initcap("candidateFirstName"||\' \'||"candidateLastName"), "positionId", "positionName", "positionStatusName", "hirerCompanyName" from candidate_hiring_steps_view where "candidateId" = $1 and "positionId" is not null;',
};
