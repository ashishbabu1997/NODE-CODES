/* prettier-ignore */

export default {
  getDistinctCompanyNames: 'select distinct c.company_name from company c left join employee e on c.company_id = e.company_id where e.account_type = 2 and e.status = true and c.status = true order by c.company_name',
  getfullNameAdmin: 'select concat(candidate_first_name,\' \',candidate_last_name) as "fullName" from candidate where status = true and candidate_status = 3 or (candidate_status=4 and created_by=1) order by "fullName"',
};
