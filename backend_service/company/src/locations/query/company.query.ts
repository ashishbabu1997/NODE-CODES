export default {
    getCompanyLocations: "SELECT * FROM company_locations WHERE company_id  = $1",
    addCompanyLocations: "INSERT INTO company_locations(company_id, company_address,country_id) VALUES ($1,$2,$3)"
}