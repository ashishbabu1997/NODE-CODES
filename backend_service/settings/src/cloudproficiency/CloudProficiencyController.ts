import { fetchCloudProficiency, createNewCloudProficiency, modifyCloudProficiency,removeCloudProficiency } from './CloudProficiencyManager';
import sendResponse from '../common/response/response';

// Fetch the CloudProficiency
export const getCloudProficiency = (req, res) => {
    fetchCloudProficiency().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

// Create new CloudProficiency
export const addCloudProficiency = (req, res) => {
    createNewCloudProficiency(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

// Update the CloudProficiency
export const updateCloudProficiency = (req, res) => {
    modifyCloudProficiency(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

// Delete the CloudProficiency
export const deleteCloudProficiency = (req, res) => {
    removeCloudProficiency(req.params).then((response: any) => {
        sendResponse(res, response.code, 1,203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,403, error.message, error.data)
    })
}