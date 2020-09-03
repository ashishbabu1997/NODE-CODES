import {  listUsersDetails} from './admin.manager';
import sendResponse from '../common/response/response';
export const listUsers = (req, res) => {
    const body = req.query;
    listUsersDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
