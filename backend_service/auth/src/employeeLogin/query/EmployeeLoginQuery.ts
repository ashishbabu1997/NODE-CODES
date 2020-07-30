export default {
    employeeLogin:`SELECT employee_id as "employeeId",company_id as "companyId" FROM employee WHERE email =$1 and password = $2 and status = true`,
}