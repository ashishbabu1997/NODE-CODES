export default {
    getAllActivePositions: 'SELECT P.position_id, P.company_id, C.company_name as company_name, P.position_name, P.location_name,P.created_on,P.job_status   FROM positions AS P INNER JOIN company AS C ON C.company_id=P.company_id WHERE P.status = true',
    getPositionByPositionID: 'SELECT P.position_id, P.company_id, C.company_name as company_name, P.position_name, P.job_description, P.developer_count, experience_level, currency_type_id, min_budget, max_budget, JS.skill_id, S.skill_name , P.location_name, P.created_on, P.job_status   FROM positions AS P INNER JOIN company AS C ON C.company_id=P.company_id LEFT OUTER JOIN job_skills JS ON JS.position_id = P.position_id LEFT OUTER JOIN skills S ON S.skill_id = JS.skill_id WHERE P.position_id = $1 ',
    updateFlag: 'UPDATE positions SET is_flag = $1 WHERE position_id = $2',
    updateReject: 'UPDATE positions SET is_reject = $1 WHERE position_id = $2',
    getProfile: "SELECT * FROM candidate WHERE company_id=$1",
    addProfile: 'INSERT INTO candidate (candidate_name, company_id, position_id, cover_note, rate) VALUES %L'
}