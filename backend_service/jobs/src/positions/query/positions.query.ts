export default {
    getCompanyPositionsForAdmin: `SELECT (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true) as "candidateCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.admin_approve_status IS NULL AND cp.status = true) as "submittedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 0) as "adminRjectedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer is NULL) as "shortListedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer = 0) as "buyerRejectedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer = 2) as "interviewCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer = 1) as "selectedCount", p.position_id as "positionId", p.position_name as "positionName", p.developer_count as "resourceCount", p.location_name as "locationName", p.created_on as "createdOn", p.job_status as "jobStatus", c.company_name as "companyName", c.company_id as "companyId", jc.job_category_name as "jobCategoryName", prs.status as "readStatus" from positions p INNER JOIN company c ON c.company_id = p.company_id INNER JOIN job_category jc ON jc.job_category_id = p.job_category_id LEFT JOIN position_read_status prs on p.position_id = prs.position_id and prs.employee_id = $3 WHERE p.status = true AND (p.position_name ILIKE $2 OR c.company_name ILIKE $2) AND CASE WHEN p.job_status = 5 then c.company_id = $1 else p.job_status != 5 end`,
    getCompanyPositionsForBuyer: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id = $1) as "totalCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1) as "candidateCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer is NULL) as "shortListedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer = 0) as "rejectedCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer = 2) as "interviewCount", (SELECT COUNT(*) FROM candidate_position cp join candidate cn on cn.candidate_id = cp.candidate_id WHERE cp.position_id = p.position_id AND cn.candidate_status = 3 AND cp.status = true AND cp.admin_approve_status = 1 AND cp.make_offer = 1) as "selectedCount", p.position_id as "positionId", p.position_name as "positionName", p.developer_count as "resourceCount", p.location_name as "locationName", p.created_on as "createdOn", p.job_status as "jobStatus", c.company_name as "companyName", c.company_id as "companyId", jc.job_category_name as "jobCategoryName", prs.status as "readStatus" from positions p INNER JOIN company c ON c.company_id = p.company_id INNER JOIN job_category jc ON jc.job_category_id = p.job_category_id LEFT JOIN position_read_status prs on p.position_id = prs.position_id and prs.employee_id=$3 WHERE p.status = true AND p.company_id = $1 AND p.position_name ILIKE $2`,
    // addJobSkills: `INSERT into job_skills (position_id ,skill_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$3) ON CONFLICT ON CONSTRAINT position_skill DO NOTHING`,
    addJobSkills: `INSERT into job_skills (position_id, skill_id, top_rated_skill, created_on, updated_on) values ($1, unnest ($2::int[]), $3, $4, $4) ON CONFLICT ON CONSTRAINT position_skill DO UPDATE SET updated_on=$4 , top_rated_skill=$3`,
    addCompanyPositions: "INSERT into positions (position_name, location_name, developer_count, company_id, allow_remote, experience_level, job_description, job_document, contract_start_date, contract_duration, currency_type_id, billing_type, min_budget, max_budget, created_by, updated_by, created_on, updated_on, job_status, job_category_id, immediate) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,5, $19, $20) RETURNING position_id",
    getPositionDetailsQuery: `select ps.job_category_id, jc.job_category_name, ps.currency_type_id, ps.max_budget, ps.min_budget, ps.billing_type, ps.contract_start_date, ps.contract_duration,ps.immediate, ps.developer_count, ps.allow_remote, ps.experience_level, ps.job_document, js.skill_id, s.skill_name, js.top_rated_skill, ps.position_name, ps.location_name, ps.created_on, ps.job_description, ps.job_status, co.company_name as "company_name", co.company_id as "company_id", cs.company_size, co.company_logo, co.company_linkedin_id, e.employee_id as "createdBy", concat(e.firstname, ' ', e.lastname) as "fullName", e.email as "email", e.telephone_number as "phoneNumber" from positions ps left join job_skills js on js.position_id = ps.position_id AND js.status = true left join skills s on s.skill_id = js.skill_id AND s.status = true left join job_category jc on jc.job_category_id = ps.job_category_id left join company co on co.company_id = ps.company_id left join company_size cs on cs.company_size_id = co.company_size_id left join employee e on e.employee_id = ps.created_by WHERE ps.status = true AND ps.position_id = $1`,
    addPositionToJob: `INSERT into job_received (position_id,job_received_status,created_on,updated_on) VALUES ($1,1,$2,$2) RETURNING job_received_id; `,
    updatePositionFirst: `UPDATE positions SET position_name = $1, location_name = $2, developer_count = $3, allow_remote = $4, experience_level = $5, job_description = $6, job_document = $7, updated_by = $8, updated_on = $9 ,job_category_id = $12 WHERE position_id = $10 AND company_id = $11 AND status = true`,
    updatePositionSecond: `UPDATE positions SET contract_start_date = $1, currency_type_id = $2, billing_type = $3, min_budget = $4, max_budget = $5 , updated_by = $6, updated_on = $7,contract_duration=$10,immediate=$11 WHERE position_id = $8 AND  company_id = $9 AND status = true`,
    deletePositionSkills: `delete from job_skills WHERE position_id = $1 AND status = true AND skill_id <> ALL ($2)`,
    changePositionStatus: `UPDATE positions SET job_status = 6, updated_on = $2 WHERE position_id = $1 AND status = true`,
    changeJobStatus: 'UPDATE positions SET job_status=$3,updated_on=$1 WHERE position_id=$2 ',
    changeJobReceivedStatus: 'UPDATE job_received SET job_received_status=$3,updated_on=$1 WHERE position_id=$2 ',
    getNames: 'SELECT DISTINCT c.company_id as "companyId", c.company_name as "companyName" from company c left join employee e on c.company_id = e.company_id WHERE c.status = true AND (e.account_type=$1) ORDER BY c.company_name',
    getCompanyName: 'SELECT company_name as "companyName" FROM company WHERE company_id=$1',
    getNotificationDetails: `select p.company_id as "companyId",p.position_name as "positionName", c.company_name as "companyName"from positions p left join company c on c.company_id = p.company_id where p.position_id = $1 and p.status = true`,
    getEmailAddressOfBuyerFromPositionId:'SELECT p.position_name ,e.email,j.job_received_id FROM positions p LEFT JOIN employee e ON e.company_id=p.company_id LEFT JOIN job_received j ON j.position_id=p.position_id WHERE p.position_id=$1 ORDER BY e.employee_id LIMIT 1',
    updatePositionStatus:'UPDATE positions SET status=$3,updated_on=$2 WHERE position_id=$1',
    updateJobReceivedStatus:'UPDATE job_received SET status=$3,updated_on=$2 WHERE position_id=$1 RETURNING job_received_id',
    updateCompanyJobStatus:'UPDATE company_job SET status=$3,updated_on=$2 WHERE job_received_id=$1',
    insertReadStatus:'INSERT INTO position_read_status( position_id, employee_id, created_on, updated_on) values ($1,$2,$3,$3) on conflict on constraint position_read_status_position_id_employee_id_unique_key do nothing'
} 