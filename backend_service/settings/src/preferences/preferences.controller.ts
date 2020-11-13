import { updateCompanyProfilePreferences, getPreferences, enableMasking } from './preferences.manager';
import sendResponse from '../common/response/response';

// Fetch the company preferences
export const getCompanyPreferences = (req, res) => {
    const body = req.query;
    getPreferences(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

// Create/Update company profile in preferences
export const updateCompanyProfile = (req, res) => {
    const body = req.body;
    updateCompanyProfilePreferences(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

// Create/Update company profile in preferences
export const enableCompanyMasking = (req, res) => {
    const body = req.body;
    enableMasking(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}