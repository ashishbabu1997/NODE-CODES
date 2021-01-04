import * as hiringManager from './hiring.manager';
import sendResponse from '../common/response/response';


export const getPositionHiringSteps = (req, res) => {
    const body = req.query;
    hiringManager.getPositionHiringSteps(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}


export const getCandidateHiringSteps = (req, res) => {
    const body = req.query;
    hiringManager.getCandidateHiringSteps(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}


export const defaultHiringSteps = (req, res) => {
    const body = req.query;
    hiringManager.getDefaultHiringSteps(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}



export const updateHiringStepDetails = (req, res) => {
    const body = req.body;
    hiringManager.updateHiringStepDetails(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

