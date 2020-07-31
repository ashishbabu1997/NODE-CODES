export default {
    getServices: `select service_id as "serviceId", service_name as "serviceName" from  services where status = true`,
    createServices: "INSERT into services (service_name,created_on ,updated_on ) values ($1 ,$2,$2 );",
    updateServices: `update services set service_name = $1, updated_on = $2 where service_id = $3 and status = true`,
    deleteServices: `update services set status = false,updated_on = $1 where service_id = $2`
}