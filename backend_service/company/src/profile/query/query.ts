export default {
    getProfiles: 'SELECT company_profile_url as "profileUrl",company_description as "description",company_logo as "logo",company_cover_page as "coverPage",company_tagline as "tagline",company_linkedin_id as "linkedinId",profile_percentage as "profilePercentage" FROM company WHERE company_id = $1',
    updateProfileDetails: "UPDATE company SET  company_profile_url= $1,company_description=$2,company_logo=$3,company_cover_page=$4,company_tagline=$5,company_linkedin_id=$6,profile_percentage=$7 WHERE company_id=$8",
}
