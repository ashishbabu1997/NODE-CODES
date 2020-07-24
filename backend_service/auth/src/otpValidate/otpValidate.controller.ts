import {otpValidate} from "./otpValidate.manager"
import sendResponse from '../common/response/response';
export const otpCheck = (req, res) => {
    const body= req.body.otp
    otpValidate(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}