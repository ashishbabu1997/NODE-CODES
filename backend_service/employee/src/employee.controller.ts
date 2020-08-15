import {createEmployee } from './employee.manager';
import sendResponse from './common/response/response';

  export const addEmployee = (req, res) => {
    const body = req.body;
    createEmployee(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}
