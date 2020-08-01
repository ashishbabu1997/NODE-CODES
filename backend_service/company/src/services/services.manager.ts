import servicesQuery from './query/services.query';
import database from '../common/database/database';

export const fetchCompanyServices = (_body) => {
    return new Promise((resolve, reject) => {
        database().connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Error in transaction', err.stack)
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                            reject({ code: 400, message: "Failed. Please try again.", data: {} });
                            return;
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const getCompanyServicesQuery = {
                    name: 'get-company-services',
                    text: servicesQuery.getCompanyServices,
                    values: [_body.companyId]
                }
                client.query(getCompanyServicesQuery, (err, servicesResponse) => {
                    if (shouldAbort(err)) return
                    let services = servicesResponse.rows
                    const getCompanyDomainsQuery = {
                        name: 'get-company-domains',
                        text: servicesQuery.getCompanyDomains,
                        values: [_body.companyId],
                    }
                    client.query(getCompanyDomainsQuery, (err, domainsResponse) => {
                        if (shouldAbort(err)) return
                        let domains = domainsResponse.rows
                        const getCompanyTechnologyAreasQuery = {
                            name: 'get-company-technologyAreas',
                            text: servicesQuery.getCompanyTechnologyAreas,
                            values: [_body.companyId]
                        }
                        client.query(getCompanyTechnologyAreasQuery, (err, technologyResponse) => {
                            if (shouldAbort(err)) return
                            let technologyAreas = technologyResponse.rows
                            const getSupportingDocumentQuery = {
                                name: 'get-company-supporting-document',
                                text: servicesQuery.getSupportingDocument,
                                values: [_body.companyId]
                            }
                            client.query(getSupportingDocumentQuery, (err, res) => {
                                if (shouldAbort(err)) return
                                let supportingDocument = res.rows[0].supportingDocument
                                client.query('COMMIT', err => {
                                    if (err) {
                                        console.error('Error committing transaction', err.stack)
                                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                        return;
                                    }
                                    done()
                                    resolve({ code: 200, message: "Services listed successfully", data: { supportingDocument, services, domains, technologyAreas } });
                                })
                            })
                        })
                    })
                })
            })
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
                            reject({ code: 400, message: "Failed. Please try again.", data: {} });
                            return;
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const getCompanyServicesOldQuery = {
                    name: 'get-company-services-old',
                    text: servicesQuery.getCompanyServicesOld,
                    values: [_body.companyId]
                }
                client.query(getCompanyServicesOldQuery, (err, res) => {
                    const response = res.rows[0];
                    const servicesOld = response.services;
                    const domainsOld = response.domains;
                    const technologyAreasOld = response.technologyAreas;
                    const services = _body.services;
                    const domains = _body.domains;
                    const technologyAreas = _body.technologyAreas;
                    const deletedServices = servicesOld.filter(e => services.indexOf(e) == -1);
                    const deletedDomains = domainsOld.filter(e => domains.indexOf(e) == -1);
                    const deletedTechnologyAreas = technologyAreasOld.filter(e => technologyAreas.indexOf(e) == -1);
                    const deleteServicesQuery = {
                        name: 'delete-company-services',
                        text: servicesQuery.deleteCompanyServices,
                        values: [_body.companyId, deletedServices],
                    }
                    client.query(deleteServicesQuery, (err, res) => {
                        if (shouldAbort(err)) return
                        const deleteDomainsQuery = {
                            name: 'delete-company-domains',
                            text: servicesQuery.deleteCompanyDomains,
                            values: [_body.companyId, deletedDomains],
                        }
                        client.query(deleteDomainsQuery, (err, res) => {
                            if (shouldAbort(err)) return
                            const deleteTechnologyAreasQuery = {
                                name: 'delete-company-technologyAreas',
                                text: servicesQuery.deleteCompanyTechnologyAreas,
                                values: [_body.companyId, deletedTechnologyAreas],
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
                                                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                                        return;
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
    })
}
