export default {
    getCompanyPositionsASCSearchWithId: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1 AND position_name LIKE %$5%) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn",p.job_status as "jobStatus",c.company_name as "companyName" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true AND p.company_id = $1 AND p.position_name LIKE %$5% ORDER BY $2 ASC LIMIT $3 OFFSET $4`,
    getCompanyPositionsASCWithId: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1 ) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn", p.job_status as "jobStatus",c.company_name as "companyName" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true AND p.company_id = $1 ORDER BY $2 ASC LIMIT $3 OFFSET $4`,
    getCompanyPositionsDESCSearchWithId: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1 AND position_name LIKE $5) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn", p.job_status as "jobStatus",c.company_name as "companyName" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true AND p.company_id = $1 AND p.position_name LIKE $5 ORDER BY $2 DESC LIMIT $3 OFFSET $4`,
    getCompanyPositionsDESCWithId: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn", p.job_status as "jobStatus",c.company_name as "companyName" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true AND p.company_id = $1 ORDER BY $2 DESC LIMIT $3 OFFSET $4`,
    getCompanyPositionsASCSearch: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND position_name LIKE %$4%) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn",p.job_status as "jobStatus",c.company_name as "companyName",c.company_id as "companyId" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true AND p.position_name LIKE %$4% ORDER BY $1 ASC LIMIT $2 OFFSET $3`,
    getCompanyPositionsASC: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn", p.job_status as "jobStatus",c.company_name as "companyName",c.company_id as "companyId" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true  ORDER BY $1 ASC LIMIT $2 OFFSET $3`,
    getCompanyPositionsDESCSearch: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND position_name LIKE $4) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn", p.job_status as "jobStatus",c.company_name as "companyName",c.company_id as "companyId" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true AND p.position_name LIKE $4 ORDER BY $1 DESC LIMIT $2 OFFSET $3`,
    getCompanyPositionsDESC: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true ) as "totalCount",p.position_id as "positionId", p.position_name as "positionName",p.location_name as "locationName",p.created_on as "createdOn", p.job_status as "jobStatus",c.company_name as "companyName",c.company_id as "companyId" from positions p INNER JOIN company c ON c.company_id=p.company_id WHERE p.status = true ORDER BY $1 DESC LIMIT $2 OFFSET $3`,
    addCompanyPositions: "INSERT into positions (position_name ,location_name ,developer_count ,company_id ,allow_remote ,experience_level ,job_description ,job_document ,contract_period ,currency_type_id ,billing_type ,min_budget ,max_budget ,hiring_step_id ,created_by ,updated_by ,created_on ,updated_on, job_status, job_category_id ) values ($1 ,$2 ,$3 ,$4 ,$5 ,$6,$7 ,$8 ,$9 ,$10 ,$11 ,$12 ,$13 ,$14 ,$15 ,$16 ,$17 ,$18, 5 ,$19) RETURNING position_id;",
    addJobSkills: `INSERT into job_skills (position_id ,skill_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT position_skill DO NOTHING`,
    addPositionSteps: `INSERT into position_hiring_steps (position_id,hiring_step_name,description,created_on,updated_on) values ($1,$2,$3,$4,$5) RETURNING position_hiring_step_id`,
    addPositionHiringStages: `INSERT into position_hiring_stages (hiring_stage_name,description,position_hiring_step_id,hiring_stage_order,created_on,updated_on) values `,
    getPositionDetailsQuery: `select ps.job_category_id,jc.job_category_name,ps.currency_type_id,ps.max_budget,ps.min_budget,ps.billing_type,ps.contract_period,ps.developer_count,ps.allow_remote,ps.experience_level,ps.job_document,js.skill_id ,s.skill_name ,ps.position_name,ps.location_name ,ps.created_on ,ps.job_description ,phs.position_hiring_step_id,phs.hiring_step_name ,phs.description ,phsg.position_hiring_stage_id ,phsg.hiring_stage_name ,phsg.hiring_stage_order,phsg.description as position_hiring_stage_description from positions ps left join position_hiring_steps phs on phs.position_id = ps.position_id and phs.status = true left join position_hiring_stages phsg on phsg.position_hiring_step_id = phs.position_hiring_step_id and phsg.status = true left join job_skills js on js.position_id = ps.position_id and js.status = true left join skills s on s.skill_id = js.skill_id and s.status = true left join job_category jc on jc.job_category_id=ps.job_category_id where ps.status = true and ps.position_id = $1`,
    editPositionHiringSteps: `UPDATE position_hiring_steps SET hiring_step_name=$2, description=$3,updated_on=$4 WHERE position_hiring_step_id=$1;`,
    editPositionHiringStagesStart: `update position_hiring_stages as phsg set hiring_stage_order = c.hiring_stage_order, hiring_stage_name = c.hiring_stage_name , description = c.description, updated_on = c.updated_on from ( values `,
    editPositionHiringStagesEnd: `) as c (hiring_stage_id,hiring_stage_name,description, hiring_stage_order,updated_on) where c.hiring_stage_id = phsg.position_hiring_stage_id`,
    addPositionToJob: `INSERT into job_received (position_id,job_received_status,created_on,updated_on) VALUES ($1,1,$2,$2)`,
    updatePositionFirst: `UPDATE positions SET position_name = $1, location_name = $2, developer_count = $3, allow_remote = $4, experience_level = $5, job_description = $6, job_document = $7, updated_by = $8, updated_on = $9 ,job_category_id = $12 WHERE position_id = $10 and company_id = $11 and status = true`,
    updatePositionSecond: `UPDATE positions SET contract_period = $1, currency_type_id = $2, billing_type = $3, min_budget = $4, max_budget = $5 , hiring_step_id = $6, updated_by = $7, updated_on = $8 WHERE position_id = $9 and  company_id = $10 and status = true`,
    getPositionSkillsOld: `SELECT ARRAY(SELECT skill_id from job_skills where position_id  = $1 AND status = true) AS skills from company where company_id = $2 AND status = true;`,
    deletePositionSkills: `delete from job_skills where position_id  = $1 and status = true  and skill_id = any($2)`,
    changePositionStatus: `UPDATE positions SET job_status = 6, updated_on = $2 WHERE position_id = $1 and status = true`,
    closeJobs: 'UPDATE positions SET job_status=8,updated_on=$1 WHERE position_id=$2 ',
    closeJobReceived: 'UPDATE job_received SET job_received_status=8,updated_on=$1 WHERE position_id=$2 ',
    getNames:'SELECT company_id,company_name from company',
    getCompanyName:'SELECT company_name as "companyName" FROM company WHERE company_id=$1'

} 