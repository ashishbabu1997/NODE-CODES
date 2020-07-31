export default {
    getCompanyPreferences: `select company_profile as "companyProfile",masked from  settings where status = true and company_id = $1`,
    updateCompanyProfile: "update settings set company_profile = $2,updated_on = $3 where company_id  = $1",
    updateCompanyMasking: "update settings set masked = $2,updated_on = $3 where company_id  = $1"
}