export default {
    getemployees: "SELECT * FROM employee WHERE company_id  = $1 AND status = true ",
    addEmploye:"INSERT INTO employee(firstname, lastname, company_id, email, role_id, created_on, empId,status) VALUES ($1, $2, $3, $4, $5,$6,$7,$8)"
}