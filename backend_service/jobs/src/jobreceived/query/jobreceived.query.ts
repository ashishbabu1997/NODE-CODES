export default {
    //getAllJobReceived: 'select jr.job_received_id, jr.position_id, p.company_id, c.company_name as company_name, p.position_name, p.location_name, jr.created_on, case when cj.company_job_status>0 then company_job_status else jr.job_received_status end jobreceivedstatus from job_received jr inner join positions p on  p.position_id =jr.position_id inner join  company c on c.company_id = p.company_id left outer join company_job cj  on cj.job_received_id = jr.job_received_id where jr.status = true',
    getAllJobReceived: `select (SELECT COUNT(*) FROM positions WHERE status = true AND company_id = $1) as "positionCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cn.company_id = $1) as "candidateCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cn.company_id = $1 AND cp.admin_approve_status is null) as "submittedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cn.company_id = $1 AND cp.admin_approve_status = 1 AND cp.make_offer is NULL) as "shortListedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cn.company_id = $1 AND cp.admin_approve_status = 1 AND cp.make_offer = 0) as "rejectedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cn.company_id = $1 AND cp.admin_approve_status = 1 AND cp.make_offer = 2) as "interviewCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cn.company_id = $1 AND cp.admin_approve_status = 1 AND cp.make_offer = 1) as "selectedCount", cj.company_job_status as "companyJobStatus", jr.job_received_id as "jobReceivedId", jr.position_id as "positionId", p.company_id as "companyId", c.company_name as "companyName", p.position_name as "positionName", p.location_name as "locationName", p.developer_count as "resourceCount", jr.created_on as "createdOn",p.contract_duration as "contractDuration",p.contract_start_date as "contractStartDate", p.job_status as "jobStatus", prs.status as "readStatus" from job_received jr left join positions p on p.position_id = jr.position_id and p.status = true and p.job_status = 6 left join company c on c.company_id = p.company_id and c.status = true left join company_job cj on cj.job_received_id = jr.job_received_id and cj.status = true and cj.company_id = $1 left join position_read_status prs on p.position_id = prs.position_id and prs.employee_id = $2 where jr.status = true`,
    getJobReceivedById: 'select cs.company_size as "companySize", p.position_id as "positionId", p.job_document as "document", p.billing_type as "billingType", p.contract_period as "contractPeriodId", jc.job_category_name as "jobCategoryName", ARRAY(SELECT skill_name from skills s left join job_skills js on js.skill_id = s.skill_id left join positions p on p.position_id = js.position_id left join job_received jr on jr.position_id = p.position_id where jr.job_received_id = $1 AND s.status = true) AS skills, P.position_id as "positionId", P.company_id as "companyId", C.company_name as "companyName", C.company_linkedin_id as "companyLinkedinId", P.position_name as "positionName", P.job_description as "jobDescription", P.developer_count as "developerCount", experience_level as "experienceLevel", p.currency_type_id as "currencyTypeId", p.min_budget AS "minBudget", p.max_budget AS "maxBudget", P.location_name as "locationName", P.created_on as "createdOn", P.job_status as "jobStatus", cj.is_flag as "isFlag", p.job_category_id as "jobCategoryId" from job_received jr left join positions p on p.position_id = jr.position_id left join company c on c.company_id = p.company_id left join company_job cj on cj.job_received_id = jr.job_received_id and cj.company_id = $2 left join job_category jc on jc.job_category_id = p.job_category_id left join company_size cs on cs.company_size_id = c.company_size_id where jr.status = true and jr.job_received_id = $1',
    updateReject: 'INSERT INTO company_job (job_received_id, company_id, company_job_status ,created_by, created_on, status ) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (job_received_id, company_id) DO UPDATE SET company_job_status = $3, updated_on = $4',
    getProfile: 'SELECT ca.cover_note as coverNote, ca.email_address as "email", ca.phone_number as "phoneNumber", ca.billing_type as "billingTypeId", ca.currency_type_id as "currencyTypeId", ca.candidate_id as "candidateId", ca.candidate_first_name as "candidateFirstName", ca.candidate_last_name as "candidateLastName", ca.rate as "rate", ca.resume as "resume", ca.candidate_status as "candidateStatus", c.company_name as "companyName", cp.admin_approve_status as "adminApproveStatus", cp.make_offer as "makeOffer" FROM candidate ca INNER JOIN company c on c.company_id = ca.company_id INNER JOIN candidate_position cp on ca.candidate_id = cp.candidate_id WHERE ca.company_id = $1 and cp.position_id = $2 and cp.status=true',
    addProfile: 'INSERT INTO candidate (candidate_first_name, candidate_last_name, company_id, job_received_id, cover_note, email_address, phone_number,created_on, updated_on, created_by, updated_by, candidate_status,image, citizenship, residence) VALUES %L RETURNING candidate_id',
    getJobStatus: `SELECT CASE WHEN (select count(*) from candidate c join candidate_position cp on c.candidate_id = cp.candidate_id where c.candidate_status=3 and cp.status=true and cp.position_id=$1)>=developer_count then 3 else 9 end as "jobStatus" from positions where position_id=$1`,
    updateCompanyJobStatus: `INSERT INTO company_job (job_received_id,company_job_status, company_id, created_by,updated_by, created_on,updated_on, status ) VALUES ($1, $2, $3, $4,$4,$5,$5,true) ON CONFLICT (job_received_id, company_id) DO UPDATE SET company_job_status=$2,updated_by=$4, updated_on = $5;`,
    getProfileByJobReceived:'SELECT ca.cover_note as coverNote,ca.email_address as "email",ca.phone_number as "phoneNumber",ca.billing_type as "billingTypeId",ca.currency_type_id as "currencyTypeId",ca.candidate_id as "candidateId", ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName", ca.rate as "rate", ca.resume  as "resume", ca.candidate_status as "candidateStatus",c.company_name as "companyName" FROM candidate ca INNER JOIN company c on c.company_id=ca.company_id WHERE  ca.job_received_id = $1',
    addCandidateSkills : 'INSERT into candidate_skill (candidate_id, skill_id, competency, preferred, years_of_experience, skill_version, created_on, updated_on, created_by, updated_by, status) values ($1, $2, $3, $4, $5, $6, $7, $7, $8, $8, $9) ON CONFLICT ON CONSTRAINT candidate_skill_candidate_id_skill_id_unique_key DO UPDATE SET updated_on=$7, competency=$3, preferred=$4, years_of_experience=$5, updated_by=$8',
    addCandidatePosition:'insert into candidate_position (position_id, candidate_id, job_receievd_id, billing_type, currency_type_id,created_by, updated_by, created_on, updated_on) values ($1,$2,$3,$4,$5,$6,$6,$7,$7) ON CONFLICT DO NOTHING',
    deleteCandidateSkills : 'delete from candidate_skill WHERE candidate_id = $1 AND status = true AND skill_id <> ALL ($2)',
    addDefaultAssessmentTraits: 'INSERT into candidate_assesement (assesement_trait, candidate_id, assesement_type, created_by, updated_by, created_on, updated_on) values (unnest(array(select (review_name) from review_steps where status = true)),$1,unnest(array(select (review_type) from review_steps where status = true)), $2, $2, $3, $3)',
    addSkillBasedAssesmentTraits : 'INSERT into candidate_assesement (assesement_trait, skill_id, candidate_id, assesement_type, created_by, updated_by, created_on, updated_on) values (unnest(array(select skill_name from candidate_skill cs join skills s on cs.skill_id = s.skill_id where candidate_id = $1 and (cs.competency = 2 or cs.competency = 3) and s.status = true)), unnest(array(select s.skill_id from candidate_skill cs join skills s on cs.skill_id = s.skill_id where candidate_id = $1 and (cs.competency = 2 or cs.competency = 3) and s.status = true)), $1, 4, $2, $2, $3, $3) on conflict on constraint candidate_assesement_candidate_id_assesment_trait_unique_key do nothing',
    getPositionName:'SELECT position_name as "position" FROM positions WHERE position_id=$1',
    deleteCandidateAssesmentTraits:'delete from candidate_assesement WHERE candidate_id = $1 AND status = true AND skill_id <> ALL ($2)',
    updateCandidateStatus:'update candidate set candidate_status=3,updated_by=$2,updated_on=$3 where candidate_id=$1 returning candidate_first_name,candidate_last_name,company_id,job_received_id;'
}