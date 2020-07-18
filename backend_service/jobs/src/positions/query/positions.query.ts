export default {
    getCompanyPositionsASCSearch: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1 AND position_name LIKE %$5%) as totalCount,position_id position_name,location_name,created_on, job_status from positions WHERE status = true AND company_id = $1 AND position_name LIKE %$5% ORDER BY $2 ASC LIMIT $3 OFFSET $4`,
    getCompanyPositionsASC: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1 ) as totalCount, position_id,position_name,location_name,created_on, job_status from positions WHERE status = true AND company_id = $1 ORDER BY $2 ASC LIMIT $3 OFFSET $4`,
    getCompanyPositionsDESCSearch: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1 AND position_name LIKE $5) as totalCount, position_id,position_name,location_name,created_on, job_status from positions WHERE status = true AND company_id = $1 AND position_name LIKE $5 ORDER BY $2 DESC LIMIT $3 OFFSET $4`,
    getCompanyPositionsDESC: `SELECT (SELECT COUNT(*) FROM positions WHERE status = true AND company_id =$1) as totalCount, position_id,position_name,location_name,created_on, job_status from positions WHERE status = true AND company_id = $1 ORDER BY $2 DESC LIMIT $3 OFFSET $4`,
    getAllActivePositions: 'SELECT P.company_id, C.name as company_name, P.position_name, P.location_name,P.created_on,P.job_status   FROM positions AS P INNER JOIN company AS C ON C.company_id=P.company_id WHERE P.status = true',
    getPositionByPositionID: 'SELECT P.company_id, C.name as company_name, P.position_name, P.job_description, P.developer_count, experience_level, currency_type_id, min_budget, max_budget, JS.skill_id, S.skill_name , P.location_name, P.created_on, P.job_status   FROM positions AS P INNER JOIN company AS C ON C.company_id=P.company_id INNER JOIN job_skills JS ON JS.position_id = P.position_id INNER JOIN skills S ON S.skill_id = JS.skill_id WHERE P.position_id = $1 ',
    addCompanyPositions: "INSERT into positions (position_name ,location_name ,developer_count ,company_id ,allow_remote ,experience_level ,job_description ,job_document ,contract_period ,currency_type_id ,billing_type ,min_budget ,max_budget ,hiring_step_id ,created_by ,updated_by ,created_on ,updated_on ) values ($1 ,$2 ,$3 ,$4 ,$5 ,$6,$7 ,$8 ,$9 ,$10 ,$11 ,$12 ,$13 ,$14 ,$15 ,$16 ,$17 ,$18 ) RETURNING position_id;",
    addJobSkills: `INSERT into job_skills (position_id ,skill_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT position_skill DO NOTHING`,
    addPositionSteps: `INSERT into position_hiring_steps (position_id,hiring_step_name,description,created_on,updated_on) values ($1,$2,$3,$4,$5) RETURNING position_hiring_step_id`,
    addPositionHiringStages: `INSERT into position_hiring_stages (hiring_stage_name,description,position_hiring_step_id,hiring_stage_order,coordinator_id,created_on,updated_on) values `,
    updateFlag: 'UPDATE positions SET is_flag = $1 WHERE position_id = $2',
    updateReject: 'UPDATE positions SET is_reject = $1 WHERE position_id = $2',
    getProfile: "SELECT * FROM candidate WHERE company_id=$1",
    addProfile: 'INSERT INTO candidate (candidate_name, company_id, position_id, cover_note, rate) VALUES %L',
    getPositionDetailsQuery:`select ps.position_name,ps.location_name ,ps.created_on ,ps.job_description ,phs.position_hiring_step_id,phs.hiring_step_name ,phs.description ,phsg.position_hiring_stage_id ,phsg.hiring_stage_name ,phsg.hiring_stage_order,phsg.description as position_hiring_stage_description from positions ps left join position_hiring_steps phs on phs.position_id = ps.position_id and phs.status = true left join position_hiring_stages phsg on phsg.position_hiring_step_id = phs.position_hiring_step_id and phsg.status = true where ps.status = true and ps.position_id = $1`
}