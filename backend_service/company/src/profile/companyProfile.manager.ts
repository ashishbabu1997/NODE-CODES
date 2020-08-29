import companyQuery from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'

export const get_Details = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get_details',
            text: companyQuery.getProfiles,
            values: [_body],
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
        const query = {
            name: 'get-account-type',
            text: companyQuery.getAccountType,
            values: [_body.companyId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: {} });
                return;
            }
            const accountType=results.rows[0].accountType
            if (accountType == 1)
            {
                    if (_body.logo==''&& _body.coverPage==''&&_body.linkedinId==''&&_body.tagline=='')
                    {
                        var count=50;

                    }
                    else if(_body.logo==''||_body.coverPage==''||_body.linkedinId==''||_body.tagline=='')
                    {
                        var count=90
                        if((_body.logo==''&& _body.coverPage=='') ||(_body.logo==''&&_body.linkedinId=='')||(_body.logo==''&&_body.tagline=='')||(_body.coverPage==''&& _body.linkedinId=='')||(_body.coverPage==''&&_body.tagline=='')||(_body.linkedinId==''&&_body.tagline==''))
                        {   
                            var count=75;
                            if((_body.logo==''&& _body.coverPage==''&&_body.linkedinId=='')||(_body.logo==''&&_body.linkedinId==''&&_body.tagline=='')||(_body.tagline==''&&_body.coverPage==''&&_body.linkedinId=='')||(_body.tagline==''&&_body.coverPage==''&&_body.logo==''))
                            {
                                var count=65;
                            }
                        }
                    }
                    else
                    {
                        var count=100
                    }
                }
            else
                {
                    if (_body.logo==''&& _body.coverPage==''&&_body.linkedinId==''&&_body.tagline=='')
                    {
                        var count=25;

                    }
                    else if(_body.logo==''||_body.coverPage==''||_body.linkedinId==''||_body.tagline=='')
                    {
                        var count=40
                        if((_body.logo==''&& _body.coverPage=='') ||(_body.logo==''&&_body.linkedinId=='')||(_body.logo==''&&_body.tagline=='')||(_body.coverPage==''&& _body.linkedinId=='')||(_body.coverPage==''&&_body.tagline=='')||(_body.linkedinId==''&&_body.tagline==''))
                        {   
                            var count=35;
                            if((_body.logo==''&& _body.coverPage==''&&_body.linkedinId=='')||(_body.logo==''&&_body.linkedinId==''&&_body.tagline=='')||(_body.tagline==''&&_body.coverPage==''&&_body.linkedinId=='')||(_body.tagline==''&&_body.coverPage==''&&_body.logo==''))
                            {
                                var count=30;
                            }
                        }
                    }
                    else
                    {
                        var count=50
                    }

                }
        console.log(count)
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update_details',
            text: companyQuery.updateProfileDetails,
            values: [_body.profileUrl, _body.description, _body.logo, _body.coverPage, _body.tagline,_body.linkedinId,count, parseInt(_body.companyId)]
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
    })
}
