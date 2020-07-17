<<<<<<< HEAD
import { createCompanyPositions, getCompanyPositions, fetchPositionDetails } from './positions.manager';
=======
import { createCompanyPositions, getCompanyPositions, getAllActivePositions, getPositionByPositionId, updateflagForPosition, updateIsRejectForPosition, addProfile, getProfileByCompanyId } from './positions.manager';
>>>>>>> feature/job_received
import sendResponse from '../common/response/response';

export const getPositions = (req, res) => {
    const body = req.query;
    getCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

<<<<<<< HEAD
export const getPositionDetails = (req, res) => {
    const body = req.params;
    fetchPositionDetails(body).then((response: any) => {
=======
export const getAllPositions = (req, res) => {
    const body = req.query;
    getAllActivePositions(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const getPositionById = (req, res) => {
    const body = req.query;
    getPositionByPositionId(body).then((response: any) => {
>>>>>>> feature/job_received
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const createPositions = (req, res) => {
    const body = req.body;
    createCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const updateFlag = (req, res) => {
    const body = req.body;
    updateflagForPosition(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const updateReject = (req, res) => {
    const body = req.body;
    updateIsRejectForPosition(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const addPositionProfile = (req, res) => {
    const body = req.body;
    addProfile(body).then((response: any) => {
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