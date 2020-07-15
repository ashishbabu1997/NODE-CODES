import {addDetails,mailer} from "./emailApi.manager"
import sendResponse from '../common/response/response';
export const getEmail = (req, res) => {
    const body= req.params
    addDetails(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
     mailer(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
         .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
    
}