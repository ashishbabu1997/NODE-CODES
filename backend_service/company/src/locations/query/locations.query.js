"use strict";
exports.__esModule = true;
exports["default"] = {
    getCompanyLocations: "SELECT company_location_id as \"locationId\",company_address as \"locationAddress\",country_id as \"countryId\" FROM company_locations WHERE company_id  = $1 AND status  = true",
    addCompanyLocations: "INSERT INTO company_locations(company_id, company_address,country_id) VALUES ($1,$2,$3)",
    updateCompanyLocations: "UPDATE company_locations SET company_address=$1,country_id = $2 WHERE company_location_id=$3 AND status = true",
    deleteCompanyLocations: "UPDATE company_locations SET status = false WHERE company_location_id = $1 AND status = true"
};
