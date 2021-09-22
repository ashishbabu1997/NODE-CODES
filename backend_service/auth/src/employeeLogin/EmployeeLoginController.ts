import { employeeLoginMethod } from "./EmployeeLoginManager"
import sendResponse from '../common/response/response';
import * as fs from 'fs';


// Employee login
export const employeeLogin = (req, res) => {
    const body = req.body;
    employeeLoginMethod(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}