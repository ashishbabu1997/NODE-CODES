import * as employeeManager from './employee.manager';
import sendResponse from '../common/response/response';


export const getEmployee = (req, res) => {
    const body = req.query;
    employeeManager.getEmployeesByCompanyId(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const addEmployee = (req, res) => {
    const body = req.body;
    employeeManager.createEmployee(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

export const updateEmployee = (req, res) => {
    const body = req.body;
    employeeManager.updateUser(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
export const getemployeeData = (req, res) => {
    const body = req.query;
    employeeManager.getUserDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const toggleEmployeeActiveStatus = (req, res) => {
    const body = req.body;
    employeeManager.toggleEmployeeActiveStatus(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}


export const setAsPrimaryContact = (req, res) => {
    const body = req.body;
    employeeManager.setAsPrimaryContact(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}