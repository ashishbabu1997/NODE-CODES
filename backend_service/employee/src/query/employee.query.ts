export default {
    "getEmail":"SELECT admin_approve_status,email FROM employee WHERE email=$1",
    "createCompany": "INSERT INTO company( company_name,created_on,user_id,company_type,company_type_id) VALUES ($1, $2,1,1,1) RETURNING company_id",
    "createEmployee": `INSERT INTO employee(firstname,lastname,email,account_type,company_id,telephone_number,created_on,user_role_id,status,admin_approve_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    "createSettings": "INSERT INTO settings(company_id, created_on) VALUES ($1, $2)",
    "storePassword":"UPDATE  employee SET password=$1 WHERE email=$2",
    "addHiringSteps": `INSERT into hiring_steps (company_id,hiring_step_name,description,created_on,updated_on) values ($1,$2,$3,$4,$5) RETURNING hiring_step_id`,
    "addHiringStages": `INSERT into hiring_stages (hiring_stage_name,description,hiring_step_id,hiring_stage_order,created_on,updated_on) values `,
    "checkEmailForCompany":'SELECT company_name,company_id FROM company WHERE company_id = (SELECT company_id FROM employee WHERE email ILIKE $1 LIMIT 1)'
}