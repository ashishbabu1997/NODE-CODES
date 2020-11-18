import companyQuery from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'

export const get_Details = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get_details',
            text: companyQuery.getProfiles,
            values: [_body.companyId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            const response = results.rows[0];
            const responseData = {
                "profileUrl": response.profileUrl === null ? '' : response.profileUrl,
                "description": response.description === null ? '' : response.description,
                "logo": response.logo === null ? '' : response.logo,
                "coverPage": response.coverPage === null ? '' : response.coverPage,
                "tagline": response.tagline === null ? '' : response.tagline,
                "accountType":response.accountType === null ? '' : response.accountType,
                "roleId":response.roleId === null ? '' : response.roleId,
                "companySizeId":response.companySizeId === null ? '' : response.companySizeId,
                "company_website":response.website === null ? '' : response.website,
                // "facebookId": response.facebookId === null ? '' : response.facebookId,
                // "instagramId": response.instagramId === null ? '' : response.instagramId,
                // "twitterId": response.twitterId === null ? '' : response.twitterId,
                "linkedinId": response.linkedinId === null ? '' : response.linkedinId,
            }
            resolve({ code: 200, message: "Profile listed successfully", data: { Profile: responseData } });
        })
    });
}
export const update_Details = (_body) => {
    return new Promise((resolve, reject) => {
        var count;
        const accountType=_body.accountType
            if (accountType == 1)
            {
                    if (_body.logo==''&& _body.coverPage==''&&_body.linkedinId==''&&_body.tagline=='')
                    {
                         count=50;

                    }
                    else if(_body.logo==''||_body.coverPage==''||_body.linkedinId==''||_body.tagline=='')
                    {
                         count=90
                        if((_body.logo==''&& _body.coverPage=='') ||(_body.logo==''&&_body.linkedinId=='')||(_body.logo==''&&_body.tagline=='')||(_body.coverPage==''&& _body.linkedinId=='')||(_body.coverPage==''&&_body.tagline=='')||(_body.linkedinId==''&&_body.tagline==''))
                        {   
                            count=75;
                            if((_body.logo==''&& _body.coverPage==''&&_body.linkedinId=='')||(_body.logo==''&&_body.linkedinId==''&&_body.tagline=='')||(_body.tagline==''&&_body.coverPage==''&&_body.linkedinId=='')||(_body.tagline==''&&_body.coverPage==''&&_body.logo==''))
                            {
                                 count=65;
                            }
                        }
                    }
                    else
                    {
                         count=100
                    }
                }
        
            else
                {
                    const profilequery = {
                        name: 'get-account-type',
                        text: companyQuery.getProfilePercentage,
                        values: [_body.companyId],
                    }
                database().query(profilequery, (error, results) => {
                    if (error) {
                            reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                            return;
                    }
                    else{
                        const profilePercentage=results.rows[0].profilePercentage
                        if (profilePercentage<=50)
                        {
                            if (_body.logo==''&& _body.coverPage==''&&_body.linkedinId==''&&_body.tagline=='')
                            {
                                 count=profilePercentage+25;

                            }
                            else if(_body.logo==''||_body.coverPage==''||_body.linkedinId==''||_body.tagline=='')
                            {
                                 count=profilePercentage+40
                                if((_body.logo==''&& _body.coverPage=='') ||(_body.logo==''&&_body.linkedinId=='')||(_body.logo==''&&_body.tagline=='')||(_body.coverPage==''&& _body.linkedinId=='')||(_body.coverPage==''&&_body.tagline=='')||(_body.linkedinId==''&&_body.tagline==''))
                                {   
                                     count=profilePercentage+35;
                                    if((_body.logo==''&& _body.coverPage==''&&_body.linkedinId=='')||(_body.logo==''&&_body.linkedinId==''&&_body.tagline=='')||(_body.tagline==''&&_body.coverPage==''&&_body.linkedinId=='')||(_body.tagline==''&&_body.coverPage==''&&_body.logo==''))
                                    {
                                        count=profilePercentage+30;
                                    }
                                }
                            }
                            else
                            {
                                count=profilePercentage+50
                            }
                        }
                    }
                })
                
            }
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update_details',
            text: companyQuery.updateProfileDetails,
            values: [_body.profileUrl, _body.description, _body.logo, _body.coverPage, _body.tagline,_body.linkedinId,count, parseInt(_body.companyId),_body.accountType,_body.roleId,_body.company_website,_body.companySizeId]
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed to update profile. Please try again.", data: {} });
                return;
            } 
            resolve({ code: 200, message: "Profile updated successfully", data: {} });
        })

    }) 
}
