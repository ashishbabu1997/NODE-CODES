import { fetchCompanyCertifications, createCompanyCertifications, updateCompanyCertifications, deleteCompanyCertifications } from './certifications.manager';
import sendResponse from '../common/response/response';

export const getCertifications = (req, res) => {
    const body = req.params;
    fetchCompanyCertifications(body).then((response: any) => sendResponse(res, response.code, 1, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, error.message, error.data))
}

export const addCertifications = (req, res) => {
    const body = req.body;
    createCompanyCertifications(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const updateCertifications = (req, res) => {
    const body = req.body;
    updateCompanyCertifications(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

export const deleteCertifications = (req, res) => {
    const body = req.params;
    deleteCompanyCertifications(body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}