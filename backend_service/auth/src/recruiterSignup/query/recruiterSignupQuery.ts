export default {
    ellowAdminSignupQuery:" INSERT INTO employee (firstname,lastname,company_id,email,telephone_number,password,account_type,user_role_id,status,admin_approve_status,created_on) VALUES ($firstname,$lastname,(select company_id from company where company_type=0),$email,$telephonenumber,$password,$accounttype,$userroleid,$status,$adminapprovestatus,$createdon)",
    getEmail:"SELECT admin_approve_status,email FROM employee WHERE email=$1",

}