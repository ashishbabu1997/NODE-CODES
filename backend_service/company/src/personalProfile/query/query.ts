export default {
    getProfiles: 'SELECT c.company_name AS "companyName",c.company_description AS "description",(SELECT cz.company_size FROM company_size as cz WHERE cz.company_size_id=c.company_size_id) as "companySize",ARRAY (SELECT se.service_name FROM services as se WHERE se.service_id=cs.service_id) AS "services",cl.street_address_1 as "addressLine1",cl.street_address_2 as "addressLine2",cl.zipcode as "zipCode",cl.city as "city",(SELECT cy.country_name FROM country as cy WHERE cy.country_id=cl.country_id) AS "companyLocation",ARRAY(SELECT sk.skill_name FROM skills as sk WHERE sk.skill_id=ct.technology_area_id) AS "skills" FROM company c left JOIN  company_services cs ON cs.company_id=c.company_id left JOIN company_locations cl ON cl.company_id=c.company_id left JOIN company_technology_areas ct ON ct.company_id=c.company_id  WHERE c.company_id=$1 ', 
}