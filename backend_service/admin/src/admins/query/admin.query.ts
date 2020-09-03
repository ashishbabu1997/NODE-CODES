export default {
    retrieveUserInfo:'SELECT e.firstname as "firstName",e.lastname as "lastName" ,e.employee_id as "employeeId",e.email as "email",e.account_type as "accountType",p.company_name as "companyName",p.company_website as "companyWebsite",s.company_size as "companySize" FROM employee e INNER JOIN company p ON p.company_id=e.company_id INNER JOIN company_size s ON s.company_size_id=p.company_size_id WHERE e.employee_id=$1',
    listUsers:'SELECT e.firstname as "firstName",e.lastname as "lastName",e.employee_id as "employeeId",e.email as "email",e.telephone_number as "phoneNumber",p.company_name as "companyName",p.company_website as "companyWebsite" FROM employee e INNER JOIN company p ON p.company_id=e.company_id',
    clearanceQuery:'UPDATE employee SET status=$2 WHERE employee_id=$1',
    storePassword:"UPDATE  employee SET password=$1 WHERE email=$2",

   
}