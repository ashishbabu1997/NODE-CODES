import servicesQuery from './query/services.query';
import database from '../common/database/database';
import * as queryService from '../queryService/queryService';

export const fetchCompanyServices = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

                let serviceResult = await client.query(queryService.getCompanyServicesQuery(_body))
                let domainResult = await client.query(queryService.getCompanyDomainsQuery(_body))
                let technologyAreaResult = await client.query(queryService.getCompanyTechnologyAreasQuery(_body))
                let supportingDocumentResult = await client.query(queryService.getSupportingDocumentQuery(_body))

                let services = serviceResult.rows, domains = domainResult.rows, technologyAreas = technologyAreaResult.rows;
                let supportingDocument = supportingDocumentResult.rows[0].supportingDocument

                resolve({ code: 200, message: "Services listed successfully", data: { supportingDocument, services, domains, technologyAreas } });

            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })

    })
}

export const createCompanyServices = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

                const getCompanyServicesOldQuery = {
                    name: 'get-company-services-old',
                    text: servicesQuery.getCompanyServicesOld,
                    values: [_body.userCompanyId]
                }
                const previousData = await client.query(getCompanyServicesOldQuery);
                if (previousData.rows.length > 0) {
                    const response = previousData.rows[0];
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
                        values: [_body.userCompanyId, deletedServices],
                    }
                    await client.query(deleteServicesQuery);
                    const deleteDomainsQuery = {
                        name: 'delete-company-domains',
                        text: servicesQuery.deleteCompanyDomains,
                        values: [_body.userCompanyId, deletedDomains],
                    }
                    await client.query(deleteDomainsQuery);
                    const deleteTechnologyAreasQuery = {
                        name: 'delete-company-technologyAreas',
                        text: servicesQuery.deleteCompanyTechnologyAreas,
                        values: [_body.userCompanyId, deletedTechnologyAreas],
                    }
                    await client.query(deleteTechnologyAreasQuery);

                }
                const addServicesQuery = {
                    name: 'create-company-services',
                    text: servicesQuery.addCompanyServices,
                    values: [_body.userCompanyId, _body.services, currentTime, currentTime],
                }
                await client.query(addServicesQuery)
                const addDomainsQuery = {
                    name: 'create-company-domains',
                    text: servicesQuery.addCompanyDomains,
                    values: [_body.userCompanyId, _body.domains, currentTime, currentTime],
                }
                await client.query(addDomainsQuery);
                const addTechnologiesQuery = {
                    name: 'create-company-technology',
                    text: servicesQuery.addCompanyTechnologyAreas,
                    values: [_body.userCompanyId, _body.technologyAreas, currentTime, currentTime],
                }
                await client.query(addTechnologiesQuery);
                const addSupportDocumentQuery = {
                    name: 'add-support-document',
                    text: servicesQuery.addSupportDocument,
                    values: [_body.supportingDocument, _body.userCompanyId],
                }
                await client.query(addSupportDocumentQuery);
                const getprofilePercentge = {
                    name: 'get-profile-percentge',
                    text: servicesQuery.getProfilePercentage,
                    values: [_body.userCompanyId],
                }
                database().query(getprofilePercentge, (error, results) => {
                    if (error) {
                        reject({ code: 400, message: "Failed to fetch profile percentage", data: {} });
                        return;
                    }
                    else {
                        const profilePercentage = results.rows[0].profilePercentage
                        if (_body.supportingDocument == '') {
                            var count = profilePercentage + 20
                        }
                        else {
                            var count = profilePercentage + 25
                        }
                    }
                    const updateProfile = {
                        name: 'profile-percentage-update',
                        text: servicesQuery.updateProfilePercentage,
                        values: [count, _body.userCompanyId],
                    }
                    database().query(updateProfile, (error, results) => {
                        if (error) {
                            reject({ code: 400, message: "Failed to update profile percentage", data: {} });
                            return;
                        }
                    })
                })

                await client.query('COMMIT')
                resolve({ code: 200, message: "Services added successfully", data: {} });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e);
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}
