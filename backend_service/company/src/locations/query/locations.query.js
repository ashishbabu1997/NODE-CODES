"use strict";
exports.__esModule = true;
exports["default"] = {
    getCompanyLocations: "SELECT company_location_id as \"locationId\",street_address_1 as \"addressLine1\",street_address_2 as \"addressLine2\",zipcode as \"zipCode\",city as \"city\",state_id as \"stateId\",country_id as \"countryId\" FROM company_locations WHERE company_id = $1 AND status  = true",
    addCompanyLocations: "INSERT INTO company_locations(company_id,street_address_1,street_address_2,zipcode,city,state_id,country_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    updateCompanyLocations: "UPDATE company_locations SET street_address_1=$1,street_address_2=$2,zipcode=$3,city=$4,state_id=$5,country_id = $6 WHERE company_location_id=$7 AND company_id = $8 AND status = true",
    deleteCompanyLocations: "UPDATE company_locations SET status=$2 WHERE company_location_id=$1",
    addTaxDetails: "UPDATE company SET gst_number=$2,pan_number=$3 WHERE company_id=$1"
};
