export default {
    getCompanyPreferences: 'select currency_type_id as "currencyTypeId" from  settings where status = true and company_id = $1',
    updateCompanyProfile: "update settings set updated_on = $3,currency_type_id =$2 where company_id  = $1",
    updateCompanyMasking: "update settings set masked = $2,updated_on = $3 where company_id  = $1"
}