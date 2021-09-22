export default {
    getCompanyLocations: `SELECT company_location_id as "locationId",street_address_1 as "streetAddress1",street_address_2 as "streetAddress2",zipcode as "zipCode",city as "city",state_id as "stateId",country_id as "countryId",pan_number as "panNumber",gst_number as "gstNumber" FROM company_locations WHERE company_id = $1`,
    addCompanyLocations: "INSERT INTO company_locations(company_id,street_address_1,street_address_2,zipcode,city,state_id,country_id,gst_number,pan_number,created_by,updated_by,created_on,updated_on,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10,$11,$11,true)",
    updateCompanyLocations: "UPDATE company_locations SET street_address_1=$1,street_address_2=$2,zipcode=$3,city=$4,state_id=$5,country_id = $6,updated_by=$9 WHERE company_location_id=$7 AND company_id = $8",
    deleteCompanyLocations:"delete from company_locations where company_location_id=$1",
    addTaxDetails:"UPDATE company SET gst_number=$2,pan_number=$3 WHERE company_id=$1"
}