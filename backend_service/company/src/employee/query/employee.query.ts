export default {
    getemployees: 'SELECT employee_id as "empId", firstname as "firstName", lastname as "lastName", company_id as "companyId", email as "email", role_id as "roleId", created_on as "createdOn", telephone_number as "contactNumber", status as "status", user_role_id as "userRoleId", primary_email as "primaryEmail" FROM employee WHERE company_id = $1 ',
    addEmploye: "INSERT INTO employee(firstname, lastname, company_id, email, role_id, created_on, contact_number, status, documents, user_role_id, account_type, created_by, updated_on, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$7,$6,$7)",
    addSubUser: "INSERT INTO employee(firstname, lastname, company_id, email, role_id, created_on, updated_on, status, user_role_id, account_type, created_by, updated_by,admin_approve_status,password,telephone_number) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8,$9,$10,$10,$11,$12,$13)",
    updateEmployee: "UPDATE employee SET firstname=$2, lastname=$3, role_id=$4, telephone_number=$5, updated_on=$6, updated_by=$7 WHERE employee_id = $1",
    deleteEmployee: "UPDATE employee SET status=false WHERE employee_id=$1",
    getEmployeeData: 'SELECT employee_id as "employeeId",firstname as "firstName",lastname as "lastName",email as "email",role_id as "roleId",contact_number as "contactNumber" FROM employee WHERE employee_id = $1 ',
    getCompanyId: "select company_id from employee where employee_id=$1",
    updatUserEmailQuery:"update employee set email=$1 where employee_id=$2",
    updateActiveState: "update employee set status = (NOT status),updated_on=$2,updated_by=$3 where employee_id=$1",
    checkEmail:'select employee_id,email,admin_approve_status from employee where email=$1',
    checkCompanyStatus:'select e.admin_approve_status from employee e  where e.primary_email=true and e.company_id=$1',
    updatePrimaryContact: "with src as (update employee set primary_email = true, updated_on = $3 ,updated_by = $4 where employee_id = $2 and company_id = $1 returning account_type) update employee set primary_email= false from src where employee_id not in ($2) and employee.account_type = src.account_type and company_id = $1"
}