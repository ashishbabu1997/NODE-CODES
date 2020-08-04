export default {
    getProfiles: 'SELECT company_profile_url as "profileUrl",company_description as "description",company_logo as "logo",company_cover_page as "coverPage",company_tagline as "tagline",company_fb_id as "facebookId",company_ig_id as "instagramId",company_twitter_id as "twitterId",company_linkedin_id as "linkedinId"  FROM company WHERE company_id = $1',
    updateProfileDetails: "UPDATE company SET  company_profile_url= $1,company_description=$2,company_logo=$3,company_cover_page=$4,company_tagline=$5,company_fb_id=$6,company_ig_id=$7,company_twitter_id=$8,company_linkedin_id=$9 WHERE company_id=$10"
}
