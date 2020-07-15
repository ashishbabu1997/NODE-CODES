export default {
    getemployees: "SELECT * FROM employee_new WHERE company_id  = $1 AND status = true ",
    addEmploye:"INSERT INTO employee_new(firstname, lastname, company_id, email, role_id, projectFiles, createdBy, created_on, status, employeeId) VALUES ($1, $2, $3, $4, $5,$6,$7 LOCALTIMESTAMP, true, $8)"
}