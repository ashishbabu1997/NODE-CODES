import {createEmployee,checkCompanyByWorkMail,createEmployeeByAdmin } from './employee.manager';
import sendResponse from './common/response/response';
import response from './common/response/response';

export const addEmployee = (req, res) => {
    const body = req.body;
    createEmployee(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const addEmployeeByAdmin = (req, res) => {
    const body = req.body;
    createEmployeeByAdmin(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const getCompanyByEmail = (req, res) => {
    const body = req.query;
    checkCompanyByWorkMail(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}
