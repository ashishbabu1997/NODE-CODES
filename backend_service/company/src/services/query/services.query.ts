export default {
    getCompanyServicesOld:`SELECT ARRAY(SELECT service_id from company_services where company_id  = $1 AND status = true) AS services,ARRAY(SELECT domain_id from company_domains where company_id  = $1 AND status = true) AS domains,ARRAY(SELECT technology_area_id from company_technology_areas where company_id  = $1 AND status = true) AS "technologyAreas" from company where company_id = $1 AND status = true;`,
    getCompanyServices: `SELECT s.service_name as "serviceName",s.service_id as "serviceId" from services s left join company_services cs on cs.service_id = s.service_id AND cs.status = true WHERE cs.company_id = $1 AND s.status = true`,
    getCompanyDomains: `SELECT d.domain_name as "domainName",d.domain_id as "domainId" from domains d left join company_domains cd on cd.domain_id = d.domain_id AND cd.status = true WHERE cd.company_id = $1 AND d.status = true`,
    getCompanyTechnologyAreas: `SELECT s.skill_name as "technologyName",s.skill_id as "technologyAreaId" from skills s left join company_technology_areas ct on ct.technology_area_id = s.skill_id AND ct.status = true WHERE ct.company_id = $1 AND s.status = true`,
    getSupportingDocument: `SELECT supporting_document as "supportingDocument" from company where company_id = $1 `,
    addCompanyServices: `INSERT into company_services (company_Id  ,service_Id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT service_unique_key DO NOTHING`,
    addCompanyDomains: `INSERT into company_domains (company_Id  ,domain_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT company_domain_unique_key DO NOTHING`,
    addCompanyTechnologyAreas: `INSERT into company_technology_areas (company_Id  ,technology_area_id,created_on,updated_on ) values ($1, unnest ($2::int[]),$3,$4) ON CONFLICT ON CONSTRAINT technology_area_unique_key DO NOTHING`,
    addSupportDocument: `UPDATE company SET supporting_document = $1 WHERE company_id = $2 AND status = true`,
    deleteCompanyServices: `delete from company_services where company_id  = $1 and status = true  and service_id = any($2)`,
    deleteCompanyDomains: `delete from company_domains where company_id  = $1 and status = true  and domain_id = any($2)`,
    deleteCompanyTechnologyAreas: `delete from company_technology_areas where company_id  = $1 and status = true  and technology_area_id = any($2)`,
    getProfilePercentage: 'SELECT profile_percentage as "profilePercentage" FROM company WHERE company_id = $1',
    updateProfilePercentage:'UPDATE company SET profile_percentage=$1 WHERE company_id=$2'
}