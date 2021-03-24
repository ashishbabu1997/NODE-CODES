export default {
    getCompanyPositionsForAdmin: `SELECT (array(select s.skill_name from skills s inner join job_skills jb on jb.skill_id=s.skill_id where jb.position_id=p.position_id and jb.top_rated_skill=true)) as "coreSkills",(array(select s.skill_name from skills s inner join job_skills jb on jb.skill_id=s.skill_id where jb.position_id=p.position_id and jb.top_rated_skill=false)) as "otherSkills",(select array(SELECT json_build_object('count', COUNT(*), 'stageName', case when chsv."positionStatusName" is null then 'Submitted to hirer' else chsv."positionStatusName" end) FROM candidate_hiring_steps_view chsv WHERE chsv."positionId" = p.position_id and chsv."cpStatus" = true and chsv."caStatus" = true and p.status = true and (chsv."candidateStatus" = 3 or (chsv."candidateStatus" = 4 and chsv."createdBy" = $employeeid)) group by chsv."positionStatusName", chsv."currentHiringStage" order by chsv."currentHiringStage" nulls first)) as "resourceSubCount", (select count(*) FROM candidate_hiring_steps_view chsv WHERE chsv."positionId" = p.position_id and chsv."cpStatus" = true and chsv."caStatus" = true and p.status = true and (chsv."candidateStatus" = 3 or (chsv."candidateStatus" = 4 and chsv."createdBy" = $employeeid))) as "totalResourceCount", (SELECT count(*) FROM candidate_hiring_steps_view chsv WHERE chsv."positionId" = p.position_id and chsv."cpStatus" = true and chsv."caStatus" = true and p.status = true and chsv."positionStatusName" = 'Resource accepted offer' and (chsv."candidateStatus" = 3 or (chsv."candidateStatus" = 4 and chsv."createdBy" = $employeeid))) as "closedPositionCount", p.position_id as "positionId", p.position_name as "positionName", p.developer_count as "resourceCount", p.location_name as "locationName", p.created_on as "createdOn", p.job_status as "jobStatus", c.company_name as "companyName", c.company_id as "companyId", jc.job_category_name as "jobCategoryName", p.allocated_to as "allocatedTo", prs.status as "readStatus", p.job_category_id as "jobCategoryId",p.allow_remote as "allowRemote",p.experience_level as "experienceLevel",p.job_description as "jobDescription",p.job_document as "jobDocument",p.currency_type_id as "currencyTypeId",p.active_date as "activeDate",p.billing_type as "billingTypeId",p.min_budget as "minBudget",p.max_budget as "maxBudget",p.hiring_step_id as "hiringStepId",p.created_by as "createdBy",p.updated_by as "updatedBy",p.deleted_by as "deletedBy",p.updated_on as "updatedOn",p.contract_duration as "contractDuration",p.immediate as "immediate",p.contract_start_date as "contractStartDate" from positions p INNER JOIN company c ON c.company_id = p.company_id INNER JOIN job_category jc ON jc.job_category_id = p.job_category_id LEFT JOIN position_read_status prs on p.position_id = prs.position_id and prs.employee_id = $employeeid WHERE p.status = true and (p.position_name ILIKE $searchkey OR c.company_name ILIKE $searchkey) `,
    getCompanyPositionsForAdminTotalCount:'select count(*) as "totalCount" from positions p INNER JOIN company c ON c.company_id = p.company_id INNER JOIN job_category jc ON jc.job_category_id = p.job_category_id LEFT JOIN position_read_status prs on p.position_id = prs.position_id and prs.employee_id = $employeeid WHERE p.status = true and (p.position_name ILIKE $searchkey OR c.company_name ILIKE $searchkey) ',
    getCompanyPositionsForBuyerTotalCount:'select count(*) as "totalCount" from positions p INNER JOIN company c ON c.company_id = p.company_id INNER JOIN job_category jc ON jc.job_category_id = p.job_category_id LEFT JOIN position_read_status prs on p.position_id = prs.position_id and prs.employee_id =$employeeid WHERE p.status = true AND p.company_id = $companyid AND p.position_name ILIKE $searchkey',
    getCompanyPositionsForBuyer: `SELECT (array(select s.skill_name from skills s inner join job_skills jb on jb.skill_id=s.skill_id where jb.position_id=p.position_id and jb.top_rated_skill=true)) as "coreSkills",(array(select s.skill_name from skills s inner join job_skills jb on jb.skill_id=s.skill_id where jb.position_id=p.position_id and jb.top_rated_skill=false)) as "otherSkills",(select array( SELECT json_build_object(\'count\', COUNT(*), \'stageName\', case when chsv."positionStatusName" is null then \'Submitted to hirer\' else "positionStatusName" end) FROM candidate_hiring_steps_view chsv WHERE chsv."positionId" = p.position_id and chsv."cpStatus" = true and p.status = true AND chsv."adminApproveStatus" = 1 group by "positionStatusName", chsv."currentHiringStage" order by chsv."currentHiringStage" nulls first)) as "resourceSubCount", (select count(*) FROM candidate_hiring_steps_view chsv WHERE chsv."positionId" = p.position_id AND chsv."adminApproveStatus" = 1 and chsv."cpStatus" = true and p.status = true) as "totalResourceCount", (SELECT count(*) FROM candidate_hiring_steps_view chsv WHERE chsv."positionId" = p.position_id and chsv."cpStatus" = true and chsv."positionStatusName" = \'Resource accepted offer\' and p.status = true group by "positionStatusName") as "closedPositionCount", p.position_id as "positionId", p.position_name as "positionName", p.developer_count as "resourceCount", p.location_name as "locationName", p.created_on as "createdOn", p.job_status as "jobStatus", c.company_name as "companyName", c.company_id as "companyId", jc.job_category_name as "jobCategoryName", prs.status as "readStatus", p.job_category_id as "jobCategoryId",p.allow_remote as "allowRemote",p.experience_level as "experienceLevel",p.job_description as "jobDescription",p.job_document as "jobDocument",p.currency_type_id as "currencyTypeId",p.billing_type as "billingTypeId",p.min_budget as "minBudget",p.max_budget as "maxBudget",p.hiring_step_id as "hiringStepId",p.created_by as "createdBy",p.updated_by as "updated_by",p.deleted_by as "deletedBy",p.active_date as "activeDate",p.updated_on as "updatedOn",p.contract_duration as "contractDuration",p.immediate as "immediate",p.contract_start_date as "contractStartDate" from positions p INNER JOIN company c ON c.company_id = p.company_id INNER JOIN job_category jc ON jc.job_category_id = p.job_category_id LEFT JOIN position_read_status prs on p.position_id = prs.position_id and prs.employee_id =$employeeid WHERE p.status = true AND p.company_id = $companyid AND p.position_name ILIKE $searchkey`,
    // addJobSkills: `INSERT into job_skills (position_id ,skill_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$3) ON CONFLICT ON CONSTRAINT position_skill DO NOTHING`,
    addJobSkills: `INSERT into job_skills (position_id, skill_id, top_rated_skill, created_on, updated_on) values ($1, unnest ($2::int[]), $3, $4, $4) ON CONFLICT ON CONSTRAINT position_skill DO UPDATE SET updated_on=$4 , top_rated_skill=$3`,
    addCompanyPositions:"INSERT into positions (position_name,location_name, developer_count, company_id, experience_level, job_description,job_document, currency_type_id, billing_type, created_by, updated_by, created_on, updated_on, job_status, job_category_id,contract_start_date,contract_duration,min_budget,max_budget) values ($name,$location, $devcount, $companyid, $explevel, $jobdesc, $doc, $currencyid, $billingtypeid, $empid, $empid, $time, $time, 5, $jobcatid,$contractstartdate,$contractduration,$minbudget,$maxbudget) RETURNING position_id",
    getPositionDetailsQuery: `select ps.job_category_id,ps.job_status,jc.job_category_name, ps.currency_type_id, ps.max_budget, ps.min_budget, ps.billing_type, ps.contract_start_date, ps.contract_duration,ps.immediate, ps.developer_count, ps.allow_remote, ps.experience_level, ps.job_document, js.skill_id, s.skill_name, js.top_rated_skill, ps.position_name, ps.location_name, ps.created_on, ps.job_description, ps.job_status, co.company_name as "company_name", co.company_id as "company_id", cs.company_size, co.company_logo, co.company_linkedin_id, e.employee_id as "createdBy", concat(e.firstname, ' ', e.lastname) as "fullName", e.email as "email", e.telephone_number as "phoneNumber" from positions ps left join job_skills js on js.position_id = ps.position_id AND js.status = true left join skills s on s.skill_id = js.skill_id AND s.status = true left join job_category jc on jc.job_category_id = ps.job_category_id left join company co on co.company_id = ps.company_id left join company_size cs on cs.company_size_id = co.company_size_id left join employee e on e.employee_id = ps.created_by WHERE ps.status = true AND ps.position_id = $1`,
    addPositionToJob: `INSERT into job_received (position_id,job_received_status,created_on,updated_on) VALUES ($1,1,$2,$2) RETURNING job_received_id; `,
    updatePositionFirst: `UPDATE positions SET position_name = $1, location_name = $2, developer_count = $3, allow_remote = $4, experience_level = $5, job_description = $6, job_document = $7, updated_by = $8, updated_on = $9 ,job_category_id = $12 WHERE position_id = $10 AND company_id = $11 AND status = true`,
    updatePositionSecond: `UPDATE positions SET contract_start_date = $1, currency_type_id = $2, billing_type = $3, min_budget = $4, max_budget = $5 , updated_by = $6, updated_on = $7,contract_duration=$10,immediate=$11 WHERE position_id = $8 AND  company_id = $9 AND status = true`,
    deletePositionSkills: `delete from job_skills WHERE position_id = $1 AND status = true AND skill_id <> ALL ($2)`,
    checkJobStatus:'select job_status from positions where position_id=$1',
    changePositionStatus: `UPDATE positions SET job_status = 6, updated_on = $2,active_date=$2 WHERE position_id = $1 AND status = true`,
    deletePositionReadStatus:'delete from position_read_status where position_id=$1',
    changeJobStatus: 'UPDATE positions SET job_status=$3,updated_on=$1 WHERE position_id=$2 ',
    changeJobReceivedStatus: 'UPDATE job_received SET job_received_status=$3,updated_on=$1 WHERE position_id=$2 ',
    getNames: 'SELECT DISTINCT c.company_id as "companyId", c.company_name as "companyName" from company c left join employee e on c.company_id = e.company_id WHERE c.status = true AND (e.account_type=$accounttype) ORDER BY c.company_name',
    getCompanyName: 'SELECT company_name as "companyName" FROM company WHERE company_id=$1',
    getNotificationDetails: `select p.company_id as "companyId",p.position_name as "positionName", c.company_name as "companyName"from positions p left join company c on c.company_id = p.company_id where p.position_id = $1 and p.status = true`,
    getEmailAddressOfBuyerFromPositionId:'SELECT p.position_name ,e.email,p.job_status,j.job_received_id FROM positions p LEFT JOIN employee e ON e.company_id=p.company_id LEFT JOIN job_received j ON j.position_id=p.position_id WHERE p.position_id=$1 ORDER BY e.employee_id LIMIT 1',
    deletePosition:'delete from positions where position_id=$1',
    updateJobReceivedStatus:'select job_received_id from  job_received  WHERE position_id=$1',
    updateCompanyJobStatus:'UPDATE company_job SET status=$3,updated_on=$2 WHERE job_received_id=$1',
    insertReadStatus:'INSERT INTO position_read_status( position_id, employee_id, created_on, updated_on) values ($1,$2,$3,$3) on conflict on constraint position_read_status_position_id_employee_id_unique_key do nothing',
    insertHiringSteps:'insert into position_hiring_step (position_id, hiring_step_name, hiring_step_type, hiring_step_order, created_by, updated_by, created_on, updated_on,hiring_assesment_name,hiring_assesment_type,"default") values ($1, $2, $3, $4, $5, $5, $6, $6,$7,$8,$9) on conflict on constraint position_hiring_step_position_id_hiring_step_name_unique_key do update set hiring_step_type=$3,hiring_step_order=$4,updated_by=$5,updated_on=$6',
    updateAllocatedTo:'Update positions set allocated_to = $1,updated_on=$3,updated_by=$4 where position_id=$2'
}


