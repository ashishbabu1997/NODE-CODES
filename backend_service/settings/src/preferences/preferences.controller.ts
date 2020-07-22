import { updateCompanyProfilePreferences, getPreferences, enableMasking } from './preferences.manager';
import sendResponse from '../common/response/response';

// Fetch the company preferences
export const getCompanyPreferences = (req, res) => {
    const body = req.params;
    getPreferences(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Create/Update company profile in preferences
export const updateCompanyProfile = (req, res) => {
    const body = req.body;
    updateCompanyProfilePreferences(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Create/Update company profile in preferences
export const enableCompanyMasking = (req, res) => {
    const body = req.body;
    enableMasking(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}