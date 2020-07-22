import { fetchCompanyServices, createCompanyServices } from './services.manager';
import sendResponse from '../common/response/response';


// Fetch services of a company
export const getServices = (req, res) => {
    const body = req.params;
    fetchCompanyServices(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}

// Create/Update services for a company
export const addServices = (req, res) => {
    const body = req.body;
    createCompanyServices(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}