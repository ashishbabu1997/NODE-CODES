import {modifyGeneralInfo,modifyOtherInfoAndSubmit} from './freelancer.manager';
import sendResponse from '../common/response/response';


export const updateGeneralInfo = (req, res) => {
    const body = req.body;
    modifyGeneralInfo(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateOtherInfoAndSubmit = (req, res) => {
    const body = req.body;
    modifyOtherInfoAndSubmit(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}