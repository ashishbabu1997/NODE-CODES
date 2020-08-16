export default {
    //getAllJobReceived: 'select jr.job_received_id, jr.position_id, p.company_id, c.company_name as company_name, p.position_name, p.location_name, jr.created_on, case when cj.company_job_status>0 then company_job_status else jr.job_received_status end jobreceivedstatus from job_received jr inner join positions p on  p.position_id =jr.position_id inner join  company c on c.company_id = p.company_id left outer join company_job cj  on cj.job_received_id = jr.job_received_id where jr.status = true',
    getAllJobReceived: `select cj.company_job_status as "companyJobStatus" ,jr.job_received_id as "jobReceivedId", jr.position_id as "positionId", p.company_id as "companyId", c.company_name as "companyName", p.position_name as "positionName", p.location_name as "locationName", jr.created_on as "createdOn", jr.job_received_status as "jobReceivedStatus" from job_received jr left join positions p on  p.position_id =jr.position_id and p.status  = true and p.job_status = 6 left join  company c on c.company_id = p.company_id and c.status = true left join company_job cj on cj.job_received_id = jr.job_received_id and cj.status = true and cj.company_id = $1 where jr.status = true`,
    getJobReceivedById: 'select P.position_id as "positionId", P.company_id as "companyId", C.company_name as "companyName", P.position_name as "positionName", P.job_description as "jobDescription", P.developer_count as "developerCount", experience_level as "experienceLevel", currency_type_id as "currencyTypeId", min_budget AS "minBudget", max_budget AS "maxBudget", JS.skill_id as "skillId", S.skill_name as "skillName" , P.location_name as "locationName", P.created_on as "createdOn", P.job_status as "jobStatus", cj.is_flag as "isFlag" from job_received jr inner join positions p on  p.position_id =jr.position_id  inner join  company c on c.company_id = p.company_id left join company_job cj on cj.job_received_id = jr.job_received_id and cj.company_id =$2 LEFT JOIN job_skills JS ON JS.position_id = P.position_id LEFT JOIN skills S ON S.skill_id = JS.skill_id where jr.status = true and jr.job_received_id =$1',
    updateFlag: 'INSERT INTO company_job (job_received_id, company_id, is_flag ,created_by, created_on, status ) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (job_received_id, company_id) DO UPDATE SET is_flag = EXCLUDED.is_flag,updated_by=$4, updated_on = $5',
    updateReject: 'INSERT INTO company_job (job_received_id, company_id, company_job_status ,created_by, created_on, status ) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (job_received_id, company_id) DO UPDATE SET company_job_status = 2, updated_on = $4',
    getProfile: 'SELECT candidate_id as "candidateId", candidate_name as "candidateName", rate as "rate", resume  as "resume", candidate_status as "candidateStatus" FROM candidate WHERE company_id=$1 and job_received_id = $2',
    addProfile: 'INSERT INTO candidate (candidate_name, company_id, job_received_id, cover_note, rate, candidate_status) VALUES %L',
    getTotalCountOfCandidatesSubmitted: `select count(*) as "candidateCount",p.developer_count as "developerCount" from candidate c left join job_received jr  on jr.job_received_id  = c.job_received_id and jr.status = true left join positions p on p.position_id = jr.position_id and p.status = true where c.job_received_id = $1 and c.company_id = $2 and c.candidate_status = 3 and c.status  = true group by p.position_id `,
    updateCompanyJobStatus:`UPDATE company_job SET company_job_status = $4, updated_on = $3 WHERE job_received_id = $1 and company_id = $2 and status = true `
}