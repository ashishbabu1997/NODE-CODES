import { fetchCompanyLocations, createCompanyLocations } from './locations.manager';
import sendResponse from '../common/response/response';

export const getlocations = (req, res) => {
    const body = req.params;
    fetchCompanyLocations(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}

export const addLocations = (req, res) => {
    const body = req.body;
    createCompanyLocations(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}