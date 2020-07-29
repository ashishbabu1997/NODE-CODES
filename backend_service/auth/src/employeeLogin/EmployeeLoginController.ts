import { employeeLoginMethod } from "./EmployeeLoginManager"
import sendResponse from '../common/response/response';
// Employee login
export const employeeLogin = (req, res) => {
    const body = req.body;
    employeeLoginMethod(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}