import { editCompanyPositionHiringSteps, fetchPositionDetails, createCompanyPositions, getCompanyPositions, updateCompanyPositions, publishCompanyPositions } from './positions.manager';
import sendResponse from '../common/response/response';

export const getPositions = (req, res) => {
    const body = req.query;
    getCompanyPositions(body).then((response: any) => {
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

export const getPositionDetails = (req, res) => {
    const body = req.params;
    fetchPositionDetails(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const editPositionHiringSteps = (req, res) => {
    const body = req.body;
    editCompanyPositionHiringSteps(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const updatePositions = (req, res) => {
    const body = req.body;
    updateCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const publishPositions = (req, res) => {
    const body = req.body;
    publishCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}