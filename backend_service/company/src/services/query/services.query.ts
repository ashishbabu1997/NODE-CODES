export default {
    getCompanyServices: "SELECT supporting_document,array_to_string( ARRAY(SELECT service_id from company_services where company_id  = $1 AND status = true),',') AS services,array_to_string( ARRAY(SELECT domain_id from company_domains where company_id  = $1 AND status = true),',') AS domains,array_to_string( ARRAY(SELECT technology_area_id from company_technology_areas where company_id  = $1 AND status = true),',') AS technologyareas from company where company_id = 1 AND status = true;",
    addCompanyServices: `INSERT into company_services (company_Id  ,service_Id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT service_unique_key DO NOTHING`,
    addCompanyDomains: `INSERT into company_domains (company_Id  ,domain_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT company_domain_unique_key DO NOTHING`,
    addCompanyTechnologyAreas: `INSERT into company_technology_areas (company_Id  ,technology_area_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT technology_area_unique_key DO NOTHING`,
    addSupportDocument: `UPDATE company SET supporting_document = $1 WHERE company_id = $2 AND status = true`,
    deleteCompanyServices: `delete from company_services where company_id  = $1 and status = true  and service_id = any($2)`,
    deleteCompanyDomains: `delete from company_domains where company_id  = $1 and status = true  and domain_id = any($2)`,
    deleteCompanyTechnologyAreas: `delete from company_technology_areas where company_id  = $1 and status = true  and technology_area_id = any($2)`
}