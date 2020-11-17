import {getEmployeesByCompanyId, createEmployee,updateUser} from './employee.manager';
import sendResponse from '../common/response/response';


export const getEmployee = (req, res) => {
    const body = req.query;
    getEmployeesByCompanyId(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const addEmployee = (req, res) => {
    const body = req.body;
    createEmployee(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

export const updateEmployee = (req, res) => {
    const body = req.body;
    updateUser(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}