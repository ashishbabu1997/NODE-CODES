export default {
    employeeLogin: `SELECT firstname as "firstName",lastname as "lastName",employee_id as "employeeId",account_type as "accountType",c.company_id as "companyId",email,c.company_name as "companyName",c.company_logo as "companyLogo" FROM employee left join company c on c.company_id = employee.company_id WHERE email =$1 and password = $2 and employee.status = true`,
}