"use strict";
exports.__esModule = true;
exports["default"] = {
    getProfiles: 'SELECT company_profile_url,company_description,company_logo,company_cover_page,company_tagline,company_fb_id,company_ig_id,company_twitter_id,company_linkedin_id  FROM company WHERE company_id = $1',
    updateProfileDetails: "UPDATE company SET  company_profile_url= $1,company_description=$2,company_logo=$3,company_cover_page=$4,company_tagline=$5,company_fb_id=$6,company_ig_id=$7,company_twitter_id=$8,company_linkedin_id=$9 WHERE company_id=$10"
};
