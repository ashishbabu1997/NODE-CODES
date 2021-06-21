export default {
    getemployees: 'SELECT employee_id as "empId",firstname as "firstName",lastname as "lastName",company_id as "companyId",email as "email",role_id as "roleId",created_on as "createdOn",contact_number as "contactNumber",status as "status",user_role_id as "userRoleId"  FROM employee WHERE company_id  = $1 AND status = true ',
    addEmploye: "INSERT INTO employee(firstname, lastname, company_id, email, role_id, created_on, contact_number, status, documents, user_role_id, account_type, created_by, updated_on, _updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$7,$6,$7)",
    updateEmployee: "UPDATE employee SET firstname=$2, lastname=$3, role_id=$4, contact_number=$5, updated_on=$6, updated_by=$7 WHERE employee_id = $1",
    deleteEmployee: "UPDATE employee SET status=false WHERE employee_id=$1",
    getEmployeeData: 'SELECT employee_id as "employeeId",firstname as "firstName",lastname as "lastName",email as "email",role_id as "roleId",contact_number as "contactNumber" FROM employee WHERE employee_id = $1 ',
    getCompanyId: "select company_id from employee where employee_id=1",
    updateActiveState: "update employee set status = (NOT status),updated_on=$2,updated_by=$3 where employee_id=$1",
    updatePrimaryContact: "update employee set primary_email = case when employee_id = $2 then true else false end, updated_on = case when employee_id = $2 then $3 else updated_on end, updated_by = case when employee_id = $2 then $4 else updated_by end where company_id = $1",

}