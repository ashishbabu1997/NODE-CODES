import { get_Details,update_Details} from './companyProfile.manager';
import sendResponse from './common/response/response';

export const getDetails = (req, res) => {
    const body = req.params.company_id;
    get_Details(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}
export const updateDetails = (req, res) => {
    const body = req.body;
    update_Details(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}