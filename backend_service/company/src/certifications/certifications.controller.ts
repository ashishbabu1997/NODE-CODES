import { fetchCompanyCertifications, createCompanyCertifications, updateCompanyCertifications, deleteCompanyCertifications } from './certifications.manager';
import sendResponse from '../common/response/response';

export const getCertifications = (req, res) => {
    const body = req.query;
    fetchCompanyCertifications(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const addCertifications = (req, res) => {
    const body = req.body;
    createCompanyCertifications(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

export const updateCertifications = (req, res) => {
    const body = req.body;
    updateCompanyCertifications(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

export const deleteCertifications = (req, res) => {
    const body = req.params;
    deleteCompanyCertifications(body).then((response: any) => {
        sendResponse(res, response.code, 1,203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,403, error.message, error.data)
    })
}