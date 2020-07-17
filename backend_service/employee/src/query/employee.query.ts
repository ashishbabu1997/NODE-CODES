export default {
    "createCompany": "INSERT INTO company( company_name, company_website, company_size_id, created_on) VALUES ($1, $2, $3, $4) RETURNING company_id",
    "createEmployee":"INSERT INTO employee(firstname, lastname, account_type, company_id, telephone_number, role_id, created_on, status) VALUES ($1, $2, $3, $4, $5, $6, $7, true)"
}