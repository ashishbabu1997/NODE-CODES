import { getCandidateDetails, editVettingStatus, listCandidatesDetails, listFreeCandidatesDetails, candidateClearance, interviewRequestFunction, addCandidateReview, removeCandidateFromPosition } from './candidates.manager';
import sendResponse from '../common/response/response';

export const candidateDetails = (req, res) => {
    const body = req.query;
    getCandidateDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const listCandidates = (req, res) => {
    const body = req.query;
    listCandidatesDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const listFreeCandidates = (req, res) => {
    const body = req.query;
    listFreeCandidatesDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const approveRejectCandidates = (req, res) => {
    const body = req.body;
    candidateClearance(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const interviewRequest = (req, res) => {
    const body = req.body;
    interviewRequestFunction(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const candidateReview = (req, res) => {
    const body = req.body;
    addCandidateReview(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}
export const candidateVettingStatus = (req, res) => {
    const body = req.body;
    editVettingStatus(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}

export const deleteCandidateFromPosition = (req, res) => {
    const body = req.query;
    removeCandidateFromPosition(body).then((response: any) => {
        sendResponse(res, response.code, 1, 203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 403, error.message, error.data)
    })
}