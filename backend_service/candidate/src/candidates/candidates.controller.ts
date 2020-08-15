import {  getCandidateDetails, listCandidatesDetails} from './candidates.manager';
import sendResponse from '../common/response/response';

export const candidateDetails = (req, res) => {
    const body = req.params;
    getCandidateDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
export const listCandidates = (req, res) => {
    const body = req.query;
    listCandidatesDetails(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
