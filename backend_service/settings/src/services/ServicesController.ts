import { getServices, createNewServices, updateServiceType,deleteServiceType } from './ServicesManager';
import sendResponse from '../common/response/response';

// Fetch the services
export const getServiceTypes = (req, res) => {
    getServices().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

// Create new services
export const addServices = (req, res) => {
    createNewServices(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

// Update the services
export const updateServices = (req, res) => {
    updateServiceType(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

// Delete the services
export const deleteServices = (req, res) => {
    deleteServiceType(req.params).then((response: any) => {
        sendResponse(res, response.code, 1,203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,403, error.message, error.data)
    })
}