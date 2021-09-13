export default {
    //getAllJobReceived: 'select jr.job_received_id, jr.position_id, p.company_id, c.company_name as company_name, p.position_name, p.location_name, jr.created_on, case when cj.company_job_status>0 then company_job_status else jr.job_received_status end jobreceivedstatus from job_received jr inner join positions p on  p.position_id =jr.position_id inner join  company c on c.company_id = p.company_id left outer join company_job cj  on cj.job_received_id = jr.job_received_id where jr.status = true',
    getAllJobReceived: `select json_build_object(\'topRatedSkills\',(SELECT json_agg(a) from (select  s.skill_name as "skillName" from skills s inner join job_skills jb on jb.skill_id = s.skill_id where jb.position_id = p.position_id and jb.top_rated_skill = true ) as a),\'otherSkills\',(SELECT json_agg(a) from (select  s.skill_name as "skillName" from skills s inner join job_skills jb on jb.skill_id = s.skill_id where jb.position_id = p.position_id and jb.top_rated_skill = false ) as a)) as skills,(select array( SELECT json_build_object(\'count\', COUNT(*), \'stageName\', case when chsv."positionStatusName" is null then \'Submitted to hirer\' else chsv."positionStatusName" end) FROM candidate_hiring_steps_view chsv join candidate cn on cn.candidate_id = chsv."candidateId" WHERE chsv."positionId" = p.position_id and chsv."cpStatus" = true and p.status = true and cn.company_id = $companyid group by "positionStatusName",chsv."currentHiringStage" order by chsv."currentHiringStage" nulls first)) as "resourceSubCount", (select count(*) FROM candidate_hiring_steps_view chsv join candidate cn on cn.candidate_id = chsv."candidateId" WHERE chsv."positionId" = p.position_id and cn.company_id = $companyid and chsv."cpStatus" = true and p.status = true) as "totalResourceCount", ( SELECT count(*) FROM candidate_hiring_steps_view chsv join candidate cn on cn.candidate_id = chsv."candidateId" WHERE chsv."positionId" = p.position_id and chsv."positionStatusName"='Resource accepted offer' and chsv."cpStatus" = true and p.status = true and cn.company_id = $companyid group by "positionStatusName") as "closedPositionCount", p.position_id as "positionId", p.company_id as "companyId", c.company_name as "companyName", p.position_name as "positionName",p.billing_type as "billingType",p.currency_type_id as "currencyTypeId", p.location_name as "locationName",p.experience_level as "experienceLevel", p.developer_count as "resourceCount", p.contract_duration as "contractDuration", p.contract_start_date as "contractStartDate",p.min_budget as "minBudget",p.max_budget as "maxBudget", p.job_status as "jobStatus", prs.status as "readStatus",p.job_category_id as "jobCategoryId",jc.job_category_name as "jobCategoryName",(select concat(e.firstname, \' \',e.lastname) from employee e where e.employee_id =p.allocated_to)as "allocatedTo" from  positions p  left join job_category jc on jc.job_category_id =p.job_category_id left join company c on c.company_id = p.company_id and c.status = true  left join position_read_status prs on p.position_id = prs.position_id and prs.employee_id = $employeeid where  p.status = true and (p.job_status = 6 or p.job_status = 8) and p.type_of_job=0 and p.allocated_to is not null `,     
    getAllJobReceivedCount:' select count(*) as "totalCount" from positions p    left join job_category jc on jc.job_category_id =p.job_category_id left join company c on c.company_id = p.company_id and c.status = true left join position_read_status prs on p.position_id = prs.position_id and prs.employee_id = $employeeid where p.status = true and (p.job_status = 6 or p.job_status = 8) and p.type_of_job=0 and  p.allocated_to is not null',
    getJobReceivedById: 'select  cs.company_size as "companySize", p.position_id as "positionId", p.job_document as "document", p.billing_type as "billingTypeId", p.contract_period as "contractPeriodId", jc.job_category_name as "jobCategoryName", (array(select s.skill_name from skills s left join job_skills js on js.skill_id = s.skill_id left join positions p on p.position_id = js.position_id  where  s.status = true and js.top_rated_skill = true and p.position_id=$1)) as "coreSkills", (array(select s.skill_name from skills s left join job_skills js on js.skill_id = s.skill_id left join positions p on p.position_id = js.position_id  where  s.status = true and js.top_rated_skill = false and p.position_id=$1)) as "otherSkills", json_build_object(\'topRatedSkill\', ARRAY(SELECT json_build_object(\'skillId\', s.skill_id, \'skillName\', s.skill_name) from skills s left join job_skills js on js.skill_id = s.skill_id left join positions p on p.position_id = js.position_id  where   s.status = true and js.top_rated_skill = true and p.position_id=$1), \'otherSkill\', ARRAY(SELECT json_build_object(\'skillId\', s.skill_id, \'skillName\', s.skill_name) from skills s left join job_skills js on js.skill_id = s.skill_id left join positions p on p.position_id = js.position_id  where  s.status = true and js.top_rated_skill = false and p.position_id=$1)) as skills, P.position_id as "positionId", P.company_id as "companyId", C.company_name as "companyName", C.company_linkedin_id as "companyLinkedinId", P.position_name as "positionName", P.job_description as "jobDescription", P.developer_count as "developerCount", experience_level as "experienceLevel", p.currency_type_id as "currencyTypeId", p.min_budget AS "minBudget", p.max_budget AS "maxBudget", P.location_name as "locationName", P.created_on as "createdOn", P.job_status as "jobStatus",  p.job_category_id as "jobCategoryId", p.contract_start_date as "contractStartDate", p.contract_duration as "contractDuration" from  positions p  left join company c on c.company_id = p.company_id  left join job_category jc on jc.job_category_id = p.job_category_id left join company_size cs on cs.company_size_id = c.company_size_id where p.position_id=$1',
    getProfile: 'SELECT ca.availability as "availability",ca.type_of_availability as "availabilityType",ca.ready_to_start as "readyToStart",ca.cover_note as coverNote, ca.email_address as "email", ca.phone_number as "phoneNumber", ca.billing_type as "billingTypeId", ca.currency_type_id as "currencyTypeId", ca.candidate_id as "candidateId", ca.candidate_first_name as "candidateFirstName", ca.candidate_last_name as "candidateLastName", ca.rate as "rate", ca.resume as "resume", ca.candidate_status as "candidateStatus", c.company_name as "companyName", cp.admin_approve_status as "adminApproveStatus", cp.make_offer as "makeOffer", (case when ca.current_ellow_stage > 0 and ca.current_ellow_stage < 6 then case when 2 = (select stage_status from candidate_assesement cas left join review_steps rs on ca.current_ellow_stage = rs.review_steps_id where cas.candidate_id = ca.candidate_id and cas.stage_name = rs.stage_name) then concat((select stage_name from review_steps where ca.current_ellow_stage = review_steps_id), \' \', \'Completed\') else case when 1 = (select stage_status from candidate_assesement cas left join review_steps rs on ca.current_ellow_stage = rs.review_steps_id where cas.candidate_id = ca.candidate_id and cas.stage_name = rs.stage_name) then concat( (select stage_name from review_steps where ca.current_ellow_stage = review_steps_id), \' \', \'Scheduled\') else case when 0 = (select stage_status from candidate_assesement cas left join review_steps rs on ca.current_ellow_stage = rs.review_steps_id where cas.candidate_id = ca.candidate_id and cas.stage_name = rs.stage_name) then \'Rejected\' end end end else case when ca.current_ellow_stage = 6 then case when 1 = (select assessment_rating from candidate_assesement cas where cas.candidate_id = ca.candidate_id and cas.stage_name = \'ellow Onboarding\') then \'ellow Certified And Vetted\' else \'Vetted\' end end end) as "stageStatusName", (case when cp.current_stage = \'Make offer\' then case when 0 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Make offer\' and cchs.position_id = cp.position_id) then \'Rejected\' else case when 2 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Make offer\' and cchs.position_id = cp.position_id) then \'Selected\' else \'Make offer\' end end else case when cp.current_stage = \'Negotiation/Close position\' then case when 1 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Negotiation/Close position\' and cchs.position_id = cp.position_id) then \'Negotiation/Close position\' else case when 2 = (select cchs.hiring_assesment_value from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Negotiation/Close position\' and cchs.position_id = cp.position_id) then \'Ellow rejected offer\' else case when 1 = (select cchs.hiring_assesment_value from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Negotiation/Close position\' and cchs.position_id = cp.position_id) then \'Resource rejected offer\' else \'Resource accepted offer\' end end end else case when cp.current_stage != \'Negotiation/Close position\' and cp.current_stage != \'Make offer\' then case when 2 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = cp.current_stage and cchs.position_id = cp.position_id) then concat(cp.current_stage, \' \', \'Completed\') else case when 0 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = cp.current_stage and cchs.position_id = cp.position_id) then \'Rejected\' else concat(cp.current_stage, \' \', \'Scheduled\') end end end end end) as positionStatusName FROM candidate ca INNER JOIN company c on c.company_id = ca.company_id INNER JOIN candidate_position cp on ca.candidate_id = cp.candidate_id WHERE ca.company_id = $1 and cp.position_id = $2 and (ca.candidate_status = 3 or ca.candidate_status != 3 and ca.company_id = $1) and cp.status = true ',
    addProfile: 'INSERT INTO candidate (candidate_first_name, candidate_last_name, company_id,cover_note, email_address, phone_number,created_on, updated_on, created_by, updated_by, candidate_status,image, citizenship, residence,candidate_position_name) VALUES %L RETURNING candidate_id',
    getJobStatus: `SELECT CASE WHEN (select count(*) from candidate c join candidate_position cp on c.candidate_id = cp.candidate_id where c.candidate_status=3 and cp.status=true and cp.position_id=$1)>=developer_count then 3 else 9 end as "jobStatus" from positions where position_id=$1`,
    // updateCompanyJobStatus: `INSERT INTO company_job (company_job_status, company_id, created_by,updated_by, created_on,updated_on, status ) VALUES ($1, $2, $3, $4,$4,$5,$5,true) ON CONFLICT ( company_id) DO UPDATE SET company_job_status=$2,updated_by=$4, updated_on = $5;`,
    getProfileByJobReceived:'SELECT ca.cover_note as coverNote,ca.email_address as "email",ca.phone_number as "phoneNumber",ca.billing_type as "billingTypeId",ca.currency_type_id as "currencyTypeId",ca.candidate_id as "candidateId", ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName", ca.rate as "rate", ca.resume  as "resume", ca.candidate_status as "candidateStatus",c.company_name as "companyName" FROM candidate ca INNER JOIN company c on c.company_id=ca.company_id WHERE  ca.job_received_id = $1',
    addCandidateSkills : 'INSERT into candidate_skill (candidate_id, skill_id, competency, preferred, years_of_experience, skill_version, created_on, updated_on, created_by, updated_by, status) values ($1, $2, $3, $4, $5, $6, $7, $7, $8, $8, $9) ON CONFLICT ON CONSTRAINT candidate_skill_candidate_id_skill_id_unique_key DO UPDATE SET updated_on=$7, competency=$3, preferred=$4, years_of_experience=$5,skill_version=$6, updated_by=$8',
    addCandidatePosition:'insert into candidate_position (position_id, candidate_id, billing_type, currency_type_id,created_by, updated_by, created_on, updated_on) values ($1,$2,$3,$4,$5,$5,$6,$6) ON CONFLICT DO NOTHING',
    modifyCandidateAvailability: `update candidate set availability = $2, type_of_availability = $3, ready_to_start = $4, updated_on=$5, updated_by = $6 where candidate_id = $1`,
    addExperience:'update candidate set work_experience=$2, remote_work_experience=$3,rate=$4, billing_type=$5, currency_type_id=$6, updated_on=$7, updated_by=$8 where candidate_id = $1',
    deleteCandidateSkills : 'delete from candidate_skill WHERE candidate_id = $1 AND status = true AND skill_id <> ALL ($2)',
    addDefaultAssessmentTraits:'insert into candidate_assesement (candidate_id, assesement_name, assesment_type, review_steps_id, stage_name, created_on, updated_on, created_by, updated_by, stage_start_date) values ($candidateid, unnest(array(select r.assessment_name from review_steps r where status = true order by step_order asc)), unnest(array(select r.review_steps_id from review_steps r where status = true order by step_order asc)), unnest(array(select r.review_steps_id from review_steps r where status = true order by step_order asc)), unnest(array(select r.stage_name from review_steps r where status = true order by step_order asc)), $currenttime, $currenttime, $employeeid, $employeeid, $currenttime)',
    getPositionName:'SELECT position_name as "position" FROM positions WHERE position_id=$1',
    getPositionCompanyName:'select c.company_name as "companyName" from company c left join positions p on p.company_id=c.company_id where p.position_id=$1',
    checkEMail:'SELECT * from employee WHERE email like $1',
    verifyFreelancerCompany:'select co.company_type,ca.candidate_first_name,ca.candidate_last_name,ca.email_address,ca.phone_number,ca.company_id from candidate ca left join company co on co.company_id=ca.company_id where ca.candidate_id=$1',
    getellowAdmins:"select concat(firstname,' ',lastname) as name ,employee_id as employeeId,email as email from employee where status=true and user_role_id=1",
    fetchCompanyName:'select company_name,company_type from company where company_id=$1',
    verifyCandidateInCandidateEmployeeTable:'select employee_id,candidate_id from  candidate_employee where candidate_id=$1',
    getDistinctJobId:'select distinct jcs.job_category_id,jc.job_category_name from job_category_skills jcs inner join job_category jc on jc.job_category_id=jcs.job_category_id order by job_category_id',
    getSkillsFromJobCategoryId:'select array( select s.skill_name from skills s inner join job_category_skills jcs on jcs.skill_id=s.skill_id where jcs.job_category_id=$1)',
    updatePassword:'update employee set password=$1,status=$2,admin_approve_status=$3 where email like $4',
    addCandidateEmployeeDetails:'insert into candidate_employee (employee_id,candidate_id,status,created_on,updated_on) values ($1,$2,$3,$4,$5)',
    addEmployee:'insert into employee (firstname,lastname,company_id,email,telephone_number,created_on,updated_on,account_type,user_role_id,admin_approve_status) values ($1,$2,$3,$4,$5,$6,$6,4,4,1) returning employee_id',
    addEmployeeByAdmin:'insert into employee (firstname,lastname,company_id,email,telephone_number,created_on,updated_on,account_type,user_role_id,admin_approve_status,password,status) values ($1,$2,$3,$4,$5,$6,$6,4,4,1,$7,true) returning employee_id',
    updateCandidateStatus:'update candidate set candidate_status=3,created_on=$3,updated_by=$2,updated_on=$3 where candidate_id=$1 returning candidate_first_name,candidate_last_name,company_id,email_address;',
    fetchResourceAllocatedRecruiterDetails:'select e.email from employee e inner join candidate c on c.allocated_to=e.employee_id where c.candidate_id=$1',
    getPositionNameFromId:'select p.position_name,e.email,c.company_name from positions p inner join employee e on e.employee_id=p.allocated_to inner join company c on c.company_id=p.company_id where p.position_id=$1',
    changeAssignee:'update candidate set allocated_to=$assigneeid, updated_on = $currenttime, updated_by=$employeeid where candidate_id=$candidateid',
}