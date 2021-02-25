import * as adminManager from './admin.manager';
import sendResponse from '../common/response/response';
export const listUsers = (req, res) => {
    const body = req.query;
    adminManager.listUsersDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const registeredUserList = (req, res) => {
    const body = req.query;
    adminManager.allUsersList(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const userDetails = (req, res) => {
    const body = req.query;
    adminManager.getUserDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
export const adminPanel = (req, res) => {
    const body = req.body;
    adminManager.clearance(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const addJobCategory = (req, res) => {
    const body = req.body;
    adminManager.addJobCategory(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const addSkills = (req, res) => {
    const body = req.body;
    adminManager.addSkills(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

