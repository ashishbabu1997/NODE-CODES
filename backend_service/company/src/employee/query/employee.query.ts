export default {
    getemployees: 'SELECT employee_id as "empId",firstname as "firstName",lastname as "lastName",company_id as "companyId",email as "email",role_id as "roleId",created_on as "createdOn",contact_number as "contactNumber",status as "status",user_role_id as "userRoleId"  FROM employee WHERE company_id  = $1 AND status = true ',
    addEmploye:"INSERT INTO employee(firstname, lastname, company_id, email, role_id, created_on, contact_number,status,documents,user_role_id) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10)",
    updateEmployee:"UPDATE employee SET first_name=$2,last_name=$3,role_id=$4,contact_number=$5 WHERE employee_id=$1",
    deleteEmployee:"UPDATE employee SET status=false WHERE employee_id=$1",
    getEmployeeData:'SELECT employee_id as "employeeId",firstname as "firstName",lastname as "lastName",email as "email",role_id as "roleId",contact_number as "contactNumber" FROM employee WHERE employee_id  = $1 ',

}