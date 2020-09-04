export default {
    getProfiles: 'SELECT * FROM (SELECT company_name as "companyName",company_description as "description" FROM company  WHERE company_id=$1)c INNER JOIN (SELECT s.service_name FROM services s INNER JOIN company_services cs ON cs.service_id=s.service_id )x ON cs.company_id=c.company_id WHERE c.company_id=$1 ' 
}