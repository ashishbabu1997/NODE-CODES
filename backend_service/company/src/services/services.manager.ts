import servicesQuery from './query/services.query';
import database from '../common/database/database';

export const fetchCompanyServices = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-company-services',
            text: servicesQuery.getCompanyServices,
            values: [_body.companyId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            console.log(results,"result data")
            const rows = results.rows[0];
            const services = rows.services != '' ? rows.services.split(',') : [];
            const domains = rows.domains != '' ? rows.domains.split(',') : [];
            const technologyAreas = rows.technologyareas != '' ? rows.technologyareas.split(',') : [];

            resolve({ code: 200, message: "Services listed successfully", data: { services, domains, technologyAreas } });
        })
    })
}

export const createCompanyServices = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        database().connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Error in transaction', err.stack)
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const deleteServicesQuery = {
                    name: 'delete-company-services',
                    text: servicesQuery.deleteCompanyServices,
                    values: [_body.companyId, _body.deletedServices],
                }
                client.query(deleteServicesQuery, (err, res) => {
                    if (shouldAbort(err)) return
                    const deleteDomainsQuery = {
                        name: 'delete-company-domains',
                        text: servicesQuery.deleteCompanyDomains,
                        values: [_body.companyId, _body.deletedDomains],
                    }
                    client.query(deleteDomainsQuery, (err, res) => {
                        if (shouldAbort(err)) return
                        const deleteTechnologyAreasQuery = {
                            name: 'delete-company-technologyAreas',
                            text: servicesQuery.deleteCompanyTechnologyAreas,
                            values: [_body.companyId, _body.deletedTechnologyAreas],
                        }
                        client.query(deleteTechnologyAreasQuery, (err, res) => {
                            if (shouldAbort(err)) return
                            const addServicesQuery = {
                                name: 'create-company-services',
                                text: servicesQuery.addCompanyServices,
                                values: [_body.companyId, _body.services, currentTime, currentTime],
                            }
                            client.query(addServicesQuery, (err, res) => {
                                if (shouldAbort(err)) return
                                const addDomainsQuery = {
                                    name: 'create-company-domains',
                                    text: servicesQuery.addCompanyDomains,
                                    values: [_body.companyId, _body.domains, currentTime, currentTime],
                                }
                                client.query(addDomainsQuery, (err, res) => {
                                    if (shouldAbort(err)) return
                                    const addTechnologiesQuery = {
                                        name: 'create-company-technology',
                                        text: servicesQuery.addCompanyTechnologyAreas,
                                        values: [_body.companyId, _body.technologyAreas, currentTime, currentTime],
                                    }
                                    client.query(addTechnologiesQuery, (err, res) => {
                                        if (shouldAbort(err)) return
                                        const addSupportDocumentQuery = {
                                            name: 'add-support-document',
                                            text: servicesQuery.addSupportDocument,
                                            values: [_body.supportingDocument, _body.companyId],
                                        }
                                        client.query(addSupportDocumentQuery, (err, res) => {
                                            if (shouldAbort(err)) return
                                            client.query('COMMIT', err => {
                                                if (err) {
                                                    console.error('Error committing transaction', err.stack)
                                                }
                                                done()
                                                resolve({ code: 200, message: "Services added successfully", data: {} });
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}
