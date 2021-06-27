import database from '../common/database/database';
import * as queryService from '../queryService/queryService';
import { getCountryStateFromId } from '../utils/utils';

export const fetchCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {

        _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

        database().query(queryService.fetchCompanyLocations(_body), (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
                return;
            }
            for (var i = 0; i < results.rowCount; i++) {
                let data = getCountryStateFromId(results.rows[i].stateId, results.rows[i].countryId);
                results.rows[i].country = data.countryName
                results.rows[i].state = data.stateName
            }
            resolve({ code: 200, message: "Locations listed successfully", data: { locations: results.rows } });
        })
    })
}

export const createCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;


        database().query(queryService.addCompanyLocations(_body), (error) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Location added successfully", data: {} });

        }).
            catch((err) => {
                reject({ code: 400, message: "Failed to connect to database", data: err.message });
            })

    })
}


export const updateCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

        database().query(queryService.updateCompanyLocations(_body), (error) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Location updated successfully", data: {} });
        })
    })
}

export const deleteCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        database().query(queryService.deleteCompanyLocations(_body), (error) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Location deleted successfully", data: {} });
        })
    })
}