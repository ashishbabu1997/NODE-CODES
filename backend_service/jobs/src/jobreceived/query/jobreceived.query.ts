export default {
    //getAllJobReceived: 'select jr.job_received_id, jr.position_id, p.company_id, c.company_name as company_name, p.position_name, p.location_name, jr.created_on, case when cj.company_job_status>0 then company_job_status else jr.job_received_status end jobreceivedstatus from job_received jr inner join positions p on  p.position_id =jr.position_id inner join  company c on c.company_id = p.company_id left outer join company_job cj  on cj.job_received_id = jr.job_received_id where jr.status = true',
    getAllJobReceived: `select (SELECT COUNT(*) FROM positions WHERE status = true AND company_id = $1) as "positionCount", (SELECT COUNT(*) FROM candidate cn WHERE cn.position_id = p.position_id AND cn.candidate_status = 3 and cn.admin_approve_status = 1) as "candidateCount", (select count(*) FROM candidate cn WHERE cn.position_id = p.position_id AND cn.candidate_status = 3 AND cn.admin_approve_status = 1 AND cn.make_offer is NULL) as "shortListedCount", (select count(*) FROM candidate cn WHERE cn.position_id = p.position_id AND cn.candidate_status = 3 AND cn.admin_approve_status = 1 AND cn.make_offer = 0) as "rejectedCount", (select count(*) FROM candidate cn WHERE cn.position_id = p.position_id AND cn.candidate_status = 3 AND cn.admin_approve_status = 1 AND cn.make_offer = 2) as "interviewCount", (select count(*) FROM candidate cn WHERE cn.position_id = p.position_id AND cn.candidate_status = 3 AND cn.admin_approve_status = 1 AND cn.make_offer = 1) as "selectedCount",cj.company_job_status as "companyJobStatus" ,jr.job_received_id as "jobReceivedId", jr.position_id as "positionId", p.company_id as "companyId", c.company_name as "companyName", p.position_name as "positionName", p.location_name as "locationName", jr.created_on as "createdOn",jr.job_received_status as "jobReceivedStatus" from job_received jr left join positions p on  p.position_id =jr.position_id and p.status  = true and p.job_status = 6 left join  company c on c.company_id = p.company_id and c.status = true left join company_job cj on cj.job_received_id = jr.job_received_id and cj.status = true and cj.company_id = $1 where jr.status = true`,
    getJobReceivedById: 'select cs.company_size as "companySize",p.position_id as "positionId",p.job_document as "document",p.billing_type as "billingType",p.contract_period as "contractPeriodId",jc.job_category_name as "jobCategoryName",ARRAY(SELECT skill_name from skills s left join job_skills js on js.skill_id = s.skill_id left join positions p on p.position_id = js.position_id left join job_received jr on jr.position_id = p.position_id where jr.job_received_id = $1 AND s.status = true) AS skills,P.position_id as "positionId", P.company_id as "companyId", C.company_name as "companyName",C.company_linkedin_id as "companyLinkedinId", P.position_name as "positionName", P.job_description as "jobDescription", P.developer_count as "developerCount", experience_level as "experienceLevel", p.currency_type_id as "currencyTypeId", p.min_budget AS "minBudget", p.max_budget AS "maxBudget",  P.location_name as "locationName", P.created_on as "createdOn", P.job_status as "jobStatus", cj.is_flag as "isFlag" from job_received jr  left join positions p on  p.position_id =jr.position_id  left join  company c on c.company_id = p.company_id left join company_job cj on cj.job_received_id = jr.job_received_id and cj.company_id =$2 left join job_category jc on jc.job_category_id = p.job_category_id left join company_size cs on cs.company_size_id = c.company_size_id where jr.status = true and jr.job_received_id = $1',
    updateFlag: 'INSERT INTO company_job (job_received_id, company_id, is_flag ,created_by, created_on, status ) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (job_received_id, company_id) DO UPDATE SET is_flag = EXCLUDED.is_flag,updated_by=$4, updated_on = $5',
    updateReject: 'INSERT INTO company_job (job_received_id, company_id, company_job_status ,created_by, created_on, status ) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (job_received_id, company_id) DO UPDATE SET company_job_status = $3, updated_on = $4',
    getProfile: 'SELECT ca.cover_note as coverNote,ca.email_address as "email",ca.phone_number as "phoneNumber",ca.billing_type as "billingTypeId",ca.currency_type_id as "currencyTypeId",ca.candidate_id as "candidateId", ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName", ca.rate as "rate", ca.resume  as "resume", ca.candidate_status as "candidateStatus",c.company_name as "companyName" FROM candidate ca INNER JOIN company c on c.company_id=ca.company_id WHERE ca.company_id=$1 and ca.job_received_id = $2',
    addProfile: 'INSERT INTO candidate (candidate_first_name,candidate_last_name, company_id, job_received_id, cover_note, rate,billing_type,currency_type_id,email_address,phone_number,resume,position_id,created_on,updated_on,created_by,updated_by, candidate_status) VALUES %L',
    getTotalCountOfCandidatesSubmitted: `select (select count(*) from candidate c left join job_received jr2 on jr2.position_id = c.position_id where c.position_id = $1 and c.company_id = $2 and c.status = true and c.candidate_status = 3 ) as candidateCount,p.developer_count from positions p left join job_received jr on jr.position_id = p.position_id and jr.status = true where jr.position_id = $1 `,
    editDetailsCandidate: 'UPDATE candidate SET company_id=$12,candidate_first_name=$2,candidate_last_name=$3,email_address=$4,phone_number=$5,rate=$6,billing_type=$7,resume=$8,currency_type_id=$9,cover_note=$10,candidate_status = $11 WHERE candidate_id=$1',
    updateCompanyJobStatus: `INSERT INTO company_job (job_received_id,company_job_status, company_id, created_by,updated_by, created_on,updated_on, status ) VALUES ($1, $2, $3, $4,$4,$5,$5,true) ON CONFLICT (job_received_id, company_id) DO UPDATE SET company_job_status=$2,updated_by=$4, updated_on = $5;`,
    getProfileByJobReceived:'SELECT ca.cover_note as coverNote,ca.email_address as "email",ca.phone_number as "phoneNumber",ca.billing_type as "billingTypeId",ca.currency_type_id as "currencyTypeId",ca.candidate_id as "candidateId", ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName", ca.rate as "rate", ca.resume  as "resume", ca.candidate_status as "candidateStatus",c.company_name as "companyName" FROM candidate ca INNER JOIN company c on c.company_id=ca.company_id WHERE  ca.job_received_id = $1',

}