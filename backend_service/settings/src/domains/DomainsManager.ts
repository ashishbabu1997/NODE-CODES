import domainsQuery from './query/DomainsQuery';
import database from '../common/database/database';

export const getDomainsList = () => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-domains',
            text: domainsQuery.getDomains,
            values: [],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Domains listed successfully", data: { domains: results.rows } });
        })
    });
}

export const createNewDomains = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'create-domains',
            text: domainsQuery.createDomains,
            values: [_body.domainName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Domain created successfully", data: {} });
        })
    })
}

export const updateDomainType = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-domians',
            text: domainsQuery.updateDomains,
            values: [_body.domainName, currentTime, _body.domainId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Domains updated successfully", data: {} });
        })
    })
}

export const deleteDomainType = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-domains',
            text: domainsQuery.deleteDomains,
            values: [currentTime, _body.domainId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Domains deleted successfully", data: {} });
        })
    })
}