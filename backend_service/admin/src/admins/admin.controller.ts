import {  listUsersDetails,allUsersList,getUserDetails,clearance} from './admin.manager';
import sendResponse from '../common/response/response';
export const listUsers = (req, res) => {
    const body = req.query;
    listUsersDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const registeredUserList = (req, res) => {
    const body = req.query;
    allUsersList(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const userDetails = (req, res) => {
    const body = req.query;
    getUserDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
export const adminPanel = (req, res) => {
    const body = req.body;
    clearance(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}


