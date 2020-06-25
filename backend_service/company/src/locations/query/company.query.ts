export default {
    getCompanyLocations: "SELECT * FROM company_locations WHERE company_id  = $1",
    addCompanyLocations: "INSERT INTO company_locations(company_id, company_address,country_id) VALUES ($1,$2,$3)",
    updateCompanyLocations: "UPDATE company_locations SET company_address=$1,country_id = $2 WHERE company_location_id=$3",
    deleteCompanyLocations:"UPDATE company_locations SET status = false WHERE company_location_id = $1"
}