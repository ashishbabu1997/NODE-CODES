import {getCompanyDetails} from './personalProfile.manager';
import sendResponse from '../common/response/response';


export const getProfile = (req, res) => {
    const body = req.query;
    getCompanyDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}