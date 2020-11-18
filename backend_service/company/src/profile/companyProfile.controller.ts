import { get_Details,update_Details} from './companyProfile.manager';
import sendResponse from '../common/response/response';

export const getDetails = (req, res) => {
    const body = req.query;
    get_Details(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
export const updateDetails = (req, res) => {
    const body = req.body;
    update_Details(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}