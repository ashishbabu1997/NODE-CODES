import { listJobCategories, createNewJobCategory, updateJobCategory, deleteJobCategory } from './jobCategory.manager';
import sendResponse from '../common/response/response';
// Fetch the domains
export const getJobCategory = (req, res) => {
    listJobCategories().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

// Create new services
export const addJobCategory = (req, res) => {
    createNewJobCategory(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

// Update the services
export const updateJobCategories = (req, res) => {
    updateJobCategory(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

// Delete the services
export const deleteJobCategories = (req, res) => {
    deleteJobCategory(req.params).then((response: any) => {
        sendResponse(res, response.code, 1,203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,403, error.message, error.data)
    })
}