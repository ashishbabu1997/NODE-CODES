import * as freelancerManager from './freelancer.manager';
import sendResponse from '../common/response/response';


export const fetchJobLists = (req, res) => {
    const body = req.query;
    freelancerManager.listJobs(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}


export const updateGeneralInfo = (req, res) => {
    const body = req.body;
    freelancerManager.modifyGeneralInfo(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateOtherInfoAndSubmit = (req, res) => {
    const body = req.body;
    freelancerManager.modifyOtherInfoAndSubmit(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}