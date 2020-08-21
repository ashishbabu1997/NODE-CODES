export default {
    "getEmail":"SELECT * FROM employee WHERE email=$1",
    "createCompany": "INSERT INTO company( company_name, company_website, company_size_id, created_on, user_id, company_type, company_type_id) VALUES ($1, $2, $3, $4, 1, 1, 1) RETURNING company_id",
    "createEmployee": `INSERT INTO employee(firstname,lastname,email,account_type,company_id,telephone_number,role_id,created_on,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    "createSettings": "INSERT INTO settings(company_id, created_on) VALUES ($1, $2)",
    "storePassword":"UPDATE  employee SET password=$1 WHERE email=$2"
}