export default {
    getDomains: `select domain_id as "domainId", domain_name as "domainName" from  domains where status = true`,
    createDomains: "INSERT into domains (domain_name,created_on ,updated_on ) values ($1 ,$2,$2 );",
    updateDomains: `update domains set domain_name = $1, updated_on = $2 where domain_id = $3 and status = true`,
    deleteDomains: `update domains set status = false,updated_on = $1 where domain_id = $2`
}