export default {
    employeeLogin: `SELECT s.masked as "masked", s.currency_type_id as "currencyTypeId", s.company_profile as "companyProfile", e.firstname as "firstName", e.lastname as "lastName", e.employee_id as "employeeId", e.account_type as "accountType", c.company_id as "companyId", e.email, e.user_role_id as "userRoleId", c.company_name as "companyName", c.company_logo as "companyLogo", ca.candidate_id as "candidateId", ca.candidate_status as "candidateStatus", e.token as "token", e.status FROM employee e left join company c on c.company_id = e.company_id left join settings s on s.company_id = c.company_id left join candidate_employee ce on e.employee_id = ce.employee_id left join candidate ca on ca.candidate_id = ce.candidate_id WHERE e.email = $1 and e.password = $2 and e.user_role_id = ANY($3::int[])`,
}