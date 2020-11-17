"use strict";
exports.__esModule = true;
exports["default"] = {
    getProfiles: 'SELECT c.company_logo as "companyLogo",c.company_cover_page as "companyCoverPage",c.company_name AS "companyName",c.company_description AS "description",(SELECT cz.company_size FROM company_size as cz WHERE cz.company_size_id=c.company_size_id) as "companySize",ARRAY (SELECT se.service_name FROM company_services cs2 left join services se on se.service_id = cs2.service_id where cs2.company_id = $1) AS "services",cl.street_address_1 as "addressLine1",cl.street_address_2 as "addressLine2",cl.zipcode as "zipCode",cl.city as "city",cl.country_id as "countryId",ARRAY(SELECT sk.skill_name FROM company_technology_areas cta left join skills sk on sk.skill_id =cta.technology_area_id WHERE cta.company_id = $1) AS "skills" FROM company c left JOIN company_locations cl ON cl.company_id=c.company_id  WHERE c.company_id= $1 '
};
