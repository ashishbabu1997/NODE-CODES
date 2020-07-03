export default {
    "createCompany": "INSERT INTO company( name, company_website, company_size_id) VALUES ($1, $2, $3) RETURNING company_id",
    "createEmployee":"INSERT INTO employee(firstname, lastname, account_type, company_id, telephone_number, role_id, created_on, status) VALUES ($1, $2, $3, $4, $5, $6, LOCALTIMESTAMP, true)"
}