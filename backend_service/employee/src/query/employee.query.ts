export default {
    "getEmail":"SELECT admin_approve_status,email FROM employee WHERE email=$1",
    "createCompany": "INSERT INTO company( company_name,created_on,user_id,company_type,company_type_id) VALUES ($1, $2,1,1,1) RETURNING company_id",
    "createEmployee": `INSERT INTO employee(firstname,lastname,email,account_type,company_id,telephone_number,created_on,user_role_id,status,admin_approve_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    "createFreelancer": `WITH data(firstname, lastname, email, yoe, accounttype, phone, companyid, userroleid, adminapprovestatus, createdtime,pass) AS ( VALUES ($firstname, $lastname, $email, $yoe::double precision, 4, $phone, (select company_id from company where company_type = 2), 4, 1, $createdtime::bigint,$pass)) , ins1 as (INSERT INTO employee (firstname, lastname, email, account_type, company_id, telephone_number, created_on, user_role_id, admin_approve_status,password,status) select firstname, lastname, email, accounttype, companyid, phone, createdtime, userroleid, adminapprovestatus, pass,true from data returning employee_id), ins2 as ( INSERT INTO candidate (candidate_first_name, candidate_last_name, company_id, email_address, work_experience, phone_number, created_on, updated_on, created_by, updated_by) select d.firstname, d.lastname, d.companyid, d.email, d.yoe, d.phone, d.createdtime, d.createdtime, ins1.employee_id, ins1.employee_id from data d,ins1 returning candidate_id ) INSERT INTO candidate_employee( employee_id, candidate_id, created_on, updated_on) select ins1.employee_id,ins2.candidate_id,d.createdtime,d.createdtime from data d,ins1,ins2 `,
    "createSettings": "INSERT INTO settings(company_id, created_on) VALUES ($1, $2)",
    "storePassword":"UPDATE  employee SET password=$1 WHERE email=$2",
    "checkEmailForCompany":'SELECT c.company_name, c.company_id, e.admin_approve_status,e.account_type FROM company c left join employee e on c.company_id = e.company_id WHERE e.email ILIKE $1 order by e.created_on LIMIT 1'
}