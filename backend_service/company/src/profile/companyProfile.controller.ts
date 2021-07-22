import * as companyProfileManager from './companyProfile.manager';
import sendResponse from '../common/response/response';

export const getDetails = (req, res) => {
    const body = req.query;
    companyProfileManager.get_Details(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
export const updateDetails = (req, res) => {
    const body = req.body;
    companyProfileManager.update_Details(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}
export const updateLogoAndProfile = (req, res) => {
    const body = req.body;
    companyProfileManager.updateProfileLogo(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const getPreferences = (req, res) => {
    const body = req.query;
    companyProfileManager.getPreferences(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
export const updatePreferences = (req, res) => {
    const body = req.body;
    companyProfileManager.updatePreferences(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

export const deleteProfile = (req, res) => {
    const body = req.body;
    companyProfileManager.deleteCompany(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}