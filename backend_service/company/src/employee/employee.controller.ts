import {getEmployeesByCompanyId, createEmployee} from './employee.manager';
import sendResponse from '../common/response/response';


export const getEmployee = (req, res) => {
    const body = req.query;
    getEmployeesByCompanyId(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}

export const addEmployee = (req, res) => {
    const body = req.body;
    createEmployee(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}