import sendResponse from '../common/response/response';
import {sendLink} from "./forgotPassword.manager"
export const resetPwd = (req, res) => {
    const body= req.body
    sendLink(body).then((response: any) => sendResponse(res, response.code, 1,201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,401,error.message, error.data))
}