import * as hiringManager from './hiring.manager';
import sendResponse from '../common/response/response';


export const getPositionHiringSteps = (req, res) => {
    const body = req.query;
    hiringManager.getAllPositionHiringSteps(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}


export const getCandidateClientHiringStepsupdateGeneralInfo = (req, res) => {
    const body = req.body;
    hiringManager.getAllCandidateClientHiringSteps(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}