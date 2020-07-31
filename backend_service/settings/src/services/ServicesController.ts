import { getServices, createNewServices, updateServiceType,deleteServiceType } from './ServicesManager';
import sendResponse from '../common/response/response';

// Fetch the services
export const getServiceTypes = (req, res) => {
    getServices().then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Create new services
export const addServices = (req, res) => {
    createNewServices(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Update the services
export const updateServices = (req, res) => {
    updateServiceType(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Delete the services
export const deleteServices = (req, res) => {
    deleteServiceType(req.params).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}