"use strict";
exports.__esModule = true;
exports["default"] = {
    get_details: "SELECT * FROM company WHERE id = ($1)",
    update_details: "UPDATE company SET companyId=$1, profileUrl= $2,description=$3,logo=$4,coverPage=$5,tagline=$6,facebookId=$7,instagramId=$8,twitterId=$9,linkedinId=$10 WHERE companyId=$11"
};
