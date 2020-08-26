export default {
    addPassword:`UPDATE employee SET password=$2 WHERE token=$1`,
    retrieveDetails:`SELECT s.masked as "masked",s.currency_type_id as "currencyTypeId", s.company_profile as "companyProfile", firstname as "firstName",lastname as "lastName",employee_id as "employeeId",account_type as "accountType",c.company_id as "companyId",email,c.company_name as "companyName",c.company_logo as "companyLogo" FROM employee left join company c on c.company_id = employee.company_id left join settings s on s.company_id = c.company_id WHERE token=$1 and employee.status = true`,
};