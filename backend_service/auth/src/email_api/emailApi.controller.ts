import {sendOtp} from "./emailApi.manager"
import sendResponse from '../common/response/response';
export const emailSignup = (req, res) => {
    const body= req.body.email
    sendOtp(body).then((response: any) => sendResponse(res, response.code, 1,201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,401, error.message, error.data))
}