import database from '../common/database/database';
import { Promise } from 'es6-promise'
import * as queryService from '../queryService/queryService';
import * as profilePercentageUtil from '../utils/profilePercentage';


export const get_Details = (_body) => {
    return new Promise((resolve, reject) => {

        _body["userCompanyId"] = _body.userRoleId == '1' ? _body["userCompanyId"] : _body.companyId;

        database().query(queryService.getCompanyProfile(_body), (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: error.message });
                return;
            }
            const response = results.rows[0];

            resolve({ code: 200, message: "Profile listed successfully", data: { Profile: response } });
        })
    });
}
export const update_Details = (_body) => {
    return new Promise((resolve, reject) => {
        var count;
        _body["userCompanyId"] = _body.userRoleId == '1' ? _body["userCompanyId"] : _body.companyId;

        const accountType = _body.accountType
        if (accountType == 1)
            count = profilePercentageUtil.hirer(_body);

        else {

            database().query(queryService.getProfilePercentage(_body), (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Failed to access profile. Please try again.", data: error.message });
                    return;
                }
                else {
                    const profilePercentage = results.rows[0].profilePercentage
                    count = profilePercentageUtil.update(_body, profilePercentage);
                }
            })

        }
        _body.count = count;

        database().query(queryService.updateCompanyProfile(_body), (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to update profile. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Profile updated successfully", data: {} });
        })
    })
}




export const updateProfileLogo = (_body) => {
    return new Promise((resolve, reject) => {
        _body["userCompanyId"] = _body.userRoleId == '1' ? _body["userCompanyId"] : _body.companyId;

        var query
        if (_body.type == 1)
            query = queryService.updateCompanyLogo(_body)
        else
            query = queryService.updateCompanyCoverPage(_body)
            
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to update image. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Image updated successfully", data: {} });
        })
    });
}


export const getPreferences = (_body) => {
    return new Promise((resolve, reject) => {

        _body["userCompanyId"] = _body.userRoleId == '1' ? _body["userCompanyId"] : _body.companyId;

        database().query(queryService.getPreferences(_body), (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: error.message});
                return;
            }
            const response = results.rows[0];

            resolve({ code: 200, message: "Profile listed successfully", data: { Profile: response } });
        })
    });
}

export const updatePreferences = (_body) => {
    return new Promise((resolve, reject) => {

        _body["userCompanyId"] = _body.userRoleId == '1' ? _body["userCompanyId"] : _body.companyId;

        database().query(queryService.updatePreferences(_body), (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Settings updated successfully", data: {} });
        })
    });
}