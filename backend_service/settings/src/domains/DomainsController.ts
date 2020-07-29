import { getDomainsList, createNewDomains, updateDomainType, deleteDomainType } from './DomainsManager';
import sendResponse from '../common/response/response';

// Fetch the domains
export const getDomains = (req, res) => {
    getDomainsList().then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Create new services
export const addDomains = (req, res) => {
    createNewDomains(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Update the services
export const updateDomains = (req, res) => {
    updateDomainType(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Delete the services
export const deleteDomain = (req, res) => {
    deleteDomainType(req.params).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}