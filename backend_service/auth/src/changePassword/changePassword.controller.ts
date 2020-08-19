import {addNewPassword} from "./changePassword.manager"
import sendResponse from '../common/response/response';
export const resetPassword = (req, res) => {
    const body= req.body
    addNewPassword(body).then((response: any) => sendResponse(res, response.code, 1,201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}