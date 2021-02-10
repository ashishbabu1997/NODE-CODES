import {createEmployee,resetFreelancerToken,checkCompanyByWorkMail,createEmployeeByAdmin,createFreelancer,tokenCheck,ellowAdminSignup,getAdminDetails,getAllEmployees } from './employee.manager';
import sendResponse from './common/response/response';
import response from './common/response/response';

export const addEmployee = (req, res) => {
    const body = req;
    createEmployee(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const addFreelancer = (req, res) => {
    const body = req.body;
    createFreelancer(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const resetToken = (req, res) => {
    const body = req.body;
    resetFreelancerToken(body).then((response: any) => {
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
export const checkVerificationLink = (req, res) => {
    const body = req.query;
    tokenCheck(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const  ellowRecruiterSignup= (req, res) => {
    const body = req.body;
    ellowAdminSignup(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}

export const  getellowAdminsDetails= (req, res) => {
    const body = req.query;
    getAdminDetails(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}
export const  getEmployeesFromCompany= (req, res) => {
    const body = req.query;
    getAllEmployees(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,error.statusCode, error.message, error.data)
    })
}