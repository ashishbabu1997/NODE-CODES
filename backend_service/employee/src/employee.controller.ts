import * as employeeManager from './employee.manager';
import sendResponse from './common/response/response';
import response from './common/response/response';

export const addEmployee = (req, res) => {
    const body = req;
    employeeManager.createEmployee(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const addFreelancer = (req, res) => {
    const body = req.body;
    employeeManager.createFreelancer(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const resetToken = (req, res) => {
    const body = req.body;
    employeeManager.resetFreelancerToken(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const addEmployeeByAdmin = (req, res) => {
    const body = req.body;
    employeeManager.createEmployeeByAdmin(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const getCompanyByEmail = (req, res) => {
    const body = req.query;
    employeeManager.checkCompanyByWorkMail(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}
export const checkVerificationLink = (req, res) => {
    const body = req.query;
    employeeManager.tokenCheck(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const  ellowRecruiterSignup= (req, res) => {
    const body = req.body;
    employeeManager.ellowAdminSignup(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const  getellowAdminsDetails= (req, res) => {
    const body = req.query;
    employeeManager.getAdminDetails(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}
export const  getEmployeesFromCompany= (req, res) => {
    const body = req.query;
    employeeManager.getAllEmployees(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

