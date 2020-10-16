import locationQuery from './query/locations.query';
import database from '../common/database/database';
import config from '../config/config'
export const fetchCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        let result = {}
        const query = {
            name: 'fetch-company-locations',
            text: locationQuery.getCompanyLocations,
            values: [_body.companyId],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            for (var i = 0; i < results.rowCount; i++) {

                const cntryId = results.rows[i].countryId
                const stId = results.rows[i].stateId
                const states = config.states
                const countries = config.countries
                const stateResult = states.filter(state => state.id == stId);
                const stateName = stateResult[0].name
                const countryResult = countries.filter(country => country.id == cntryId);
                const countryName = countryResult[0].name
                results.rows[i].country = countryName
                results.rows[i].state = stateName
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
            values: [_body.companyId, _body.streetAddress1, _body.streetAddress2, _body.zipCode, _body.city, _body.stateId, _body.countryId],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
        })
        if(_body.gstNumber && _body.panNumber)
        {
            const taxQuery = {
                name: 'add-gst-pan',
                text: locationQuery.addTaxDetails,
                values: [_body.companyId,_body.gstNumber,_body.panNumber],
            }
            database().query(taxQuery, (error, results) => {
                if (error) {
                    console.log(error)
                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Locations,PAN Number and GST Number added successfully", data: {} });
            })

        }
        else{
            resolve({ code: 200, message: "Location added successfully", data: {} });
        }
    })
}


export const updateCompanyLocations = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-company-locations',
            text: locationQuery.updateCompanyLocations,
            values: [_body.streetAddress1, _body.streetAddress2, _body.zipCode, _body.city, _body.stateId, _body.countryId, _body.locationId, _body.companyId]
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
            values: [parseInt(_body.locationId),false]
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            console.log(query)
            resolve({ code: 200, message: "Location deleted successfully", data: {} });
        })
    })
}