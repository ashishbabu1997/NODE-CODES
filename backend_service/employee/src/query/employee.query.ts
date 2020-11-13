export default {
    "getEmail":"SELECT admin_approve_status,email FROM employee WHERE email=$1",
    "createCompany": "INSERT INTO company( company_name,created_on,user_id,company_type,company_type_id) VALUES ($1, $2,1,1,1) RETURNING company_id",
    "createEmployee": `INSERT INTO employee(firstname,lastname,email,account_type,company_id,telephone_number,created_on,user_role_id,status,admin_approve_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    "createSettings": "INSERT INTO settings(company_id, created_on) VALUES ($1, $2)",
    "storePassword":"UPDATE  employee SET password=$1 WHERE email=$2",
    "checkEmailForCompany":'SELECT c.company_name, c.company_id, e.admin_approve_status,e.account_type FROM company c left join employee e on c.company_id = e.company_id WHERE e.email ILIKE $1 order by e.created_on LIMIT 1'
}