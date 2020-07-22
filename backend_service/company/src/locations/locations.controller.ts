import { fetchCompanyLocations, createCompanyLocations, updateCompanyLocations, deleteCompanyLocations } from './locations.manager';
import sendResponse from '../common/response/response';

// Fetch locations of a company
export const getlocations = (req, res) => {
    const body = req.params;
    fetchCompanyLocations(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}

// Create new company locations
export const addLocations = (req, res) => {
    const body = req.body;
    createCompanyLocations(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Update company locations
export const updateLocations = (req, res) => {
    const body = req.body;
    updateCompanyLocations(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Delete company locations
export const deleteLocations = (req, res) => {
    const body = req.params;
    deleteCompanyLocations(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}