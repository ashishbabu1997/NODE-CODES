import { createCompanyHiringSteps, getCompanyHiringSteps, editCompanyHiringSteps } from './hiringStep.manager';
import sendResponse from '../common/response/response';

// Fetch the company hiring steps
export const getHiringSteps = (req, res) => {
    const body = req.params;
    getCompanyHiringSteps(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

// Create new hiring steps for the company
export const createHiringSteps = (req, res) => {
    const body = req.body;
    createCompanyHiringSteps(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

// Edit the hiring steps of a company
export const editHiringSteps = (req, res) => {
    const body = req.body;
    editCompanyHiringSteps(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}