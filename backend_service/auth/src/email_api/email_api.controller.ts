import {addDetails,mailer} from "./email_api.manager"
import sendResponse from '../common/response/response';
import * as get_otp from "./otp_generator"
export const getEmail = (req, res) => {
    const email= req.body.email;
    const otp=get_otp.otp
    addDetails(email,otp).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
    mailer(email,otp).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
    
    
}