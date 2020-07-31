import {getAllJobReceived, getJobReceivedByJobReceivedId, updateflagForJobReceived, updateIsRejectForJobReceived, addProfile, getProfileByCompanyId, saveCandidateProfile } from './jobreceived.manager';
import sendResponse from '../common/response/response';

export const getJobReceived = (req, res) => {
    const body = req.query;
    getAllJobReceived(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const getJobReceivedById = (req, res) => {
    const body = req.query;
    getJobReceivedByJobReceivedId(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}
export const updateFlag = (req, res) => {
    const body = req.body;
    updateflagForJobReceived(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const updateReject = (req, res) => {
    const body = req.body;
    updateIsRejectForJobReceived(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const submitProfile = (req, res) => {
    const body = req.body;
    addProfile(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const saveProfile = (req, res) => {
    const body = req.body;
    saveCandidateProfile(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const getProfile = (req, res) => {
    const body = req.query;
    getProfileByCompanyId(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}