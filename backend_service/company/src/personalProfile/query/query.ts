export default {
    getProfiles: 'SELECT c.company_name as "companyName",c.company_description as "description",(SELECT cz.company_size FROM company_size as cz WHERE cz.company_size_id=c.company_size_id) as "companySize",(SELECT se.service_name FROM services as se WHERE se.service_id=cs.service_id) as "services",cl.company_address as "companyAddress",(SELECT cy.country_name FROM country as cy WHERE cy.country_id=cl.country_id) as "companyLocation",(SELECT sk.skill_name FROM skills as sk WHERE sk.skill_id=ct.technology_area_id) as "skills" FROM company c INNER JOIN  company_services cs ON cs.company_id=c.company_id INNER JOIN company_locations cl ON cl.company_id=c.company_id INNER JOIN company_technology_areas ct ON ct.company_id=c.company_id  WHERE c.company_id=$1 ', 
    getPositionId:'SELECT position_id FROM positions WHERE company_id=$1'
}