import database from '../common/database/database';
import * as queryService from '../queryService/queryService';
import * as profilePercentageUtil from '../utils/profilePercentage';
import employeeQuery from '../employee/query/employee.query';
import { notNull } from '../utils/utils';


export const get_Details = (_body) => {
    return new Promise((resolve, reject) => {

        _body["userCompanyId"] = _body.userRoleId == '1' ? _body["userCompanyId"] : _body.companyId;
        

        database().query(queryService.getCompanyProfile(_body), (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: error.message });
                return;
            }
            console.log(results.rows,"Dasdasda")
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
                reject({ code: 400, message: "Failed to access profile. Please try again.", data: error.message });
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

export const deleteCompany = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');

                if (notNull(_body.userCompanyId)) {
                    let employeeList = await client.query(queryService.getEmployeeDetailsFromCompanyId(_body, employeeQuery.getemployees));
                    let positionList = await client.query(queryService.getCompanyPositions(_body));
                    let resourceList = await client.query(queryService.getCompanyResources(_body));

                    if (!_body.forceRemove && (employeeList.rowCount > 0 || positionList.rowCount > 0 || resourceList.rowCount > 0)) {
                        reject({ code: 400, message: "The company is linked to other data please check before proceeding", data: { employees: employeeList.rows, positions: positionList.rows, resources: resourceList.rows } });
                    }

                    else if (_body.inActivate) {
                        await client.query(queryService.inactivateCompany(_body));
                        await client.query(queryService.inactivatePositions(_body));
                        await client.query(queryService.inactivateResources(_body));
                    }

                    else if (_body.permanentDelete) {
                        await client.query(queryService.permanentDeleteCompany(_body));
                    }
                }

                await client.query('COMMIT');
                resolve({ code: 200, message: "Company removed successfully", data: {} });
            } catch (e) {
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}