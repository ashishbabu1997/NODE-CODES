export default {
    "getEmail":"SELECT email FROM employee WHERE employee_id=$1",
    "createCompany": "INSERT INTO company( company_name, company_website, company_size_id, created_on, user_id, company_type, company_type_id) VALUES ($1, $2, $3, $4, 1, 1, 1) RETURNING company_id",
    "createEmployee": `UPDATE employee SET firstname=$1,lastname = $2,account_type = $3,company_id = $4,telephone_number = $5,role_id = $6 ,created_on = $7,status = true WHERE employee_id=$8 AND status = false`,
    "createSettings": "INSERT INTO settings(company_id, created_on) VALUES ($1, $2)",
    "storePassword":"UPDATE  employee SET password=$1 WHERE employee_id=$2"

}