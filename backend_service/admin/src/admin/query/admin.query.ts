export default {
    listUsers:'SELECT e.firstname as "firstName",e.lastname as "lastName" ,e.email as "email",e.telephone_number as "phoneNumber",p.company_name as "companyName",p.company_website as "companyWebsite" FROM employee e INNER JOIN company p ON p.company_id=e.company_id'
   
}