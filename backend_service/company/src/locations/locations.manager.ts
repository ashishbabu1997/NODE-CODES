import locationQuery from './query/locations.query';
import database from '../common/database/database';

export const fetchCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-company-locations',
            text: locationQuery.getCompanyLocations,
            values: [parseInt(_body.companyId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Locations listed successfully", data: { locations: results.rows } });
        })
    })
}

export const createCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'add-company-locations',
            text: locationQuery.addCompanyLocations,
            values: [_body.companyId, _body.streetAddress1,_body.streetAddress2,_body.zipCode,_body.city,_body.stateId, _body.countryId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Location added successfully", data: {} });
        })
    })
}


export const updateCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-company-locations',
            text: locationQuery.updateCompanyLocations,
            values: [ _body.streetAddress1,_body.streetAddress2,_body.zipCode,_body.city,_body.stateId, _body.countryId, _body.locationId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Location updated successfully", data: {} });
        })
    })
}

export const deleteCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-company-locations',
            text: locationQuery.deleteCompanyLocations,
            values: [_body.locationId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Location deleted successfully", data: {} });
        })
    })
}