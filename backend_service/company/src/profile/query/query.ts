export default {
    getProfiles: 'SELECT company_profile_url as "profileUrl",company_description as "description",company_logo as "logo",company_cover_page as "coverPage",company_tagline as "tagline",company_linkedin_id as "linkedinId",company_type as "accountType",user_id as "roleId",company_size_id "companySizeId",company_website as "website" FROM company WHERE company_id = $1',
    getAccountType: 'SELECT account_type as "accountType" FROM employee WHERE company_id = $1',
    updateProfileDetails: "UPDATE company SET  company_profile_url= $1,company_description=$2,company_logo=$3,company_cover_page=$4,company_tagline=$5,company_linkedin_id=$6,profile_percentage=$7,company_type=$9,user_id=$10,company_website=$11,company_size_id=$12 WHERE company_id=$8",
    getProfilePercentage: 'SELECT profile_percentage as "profilePercentage" FROM company WHERE company_id = $1'

}
