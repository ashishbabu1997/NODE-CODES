import {sendOtp} from "./emailApi.manager"
import sendResponse from '../common/response/response';
export const emailSignup = (req, res) => {
    const body= req.body.email
    console.log(body)
    sendOtp(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}