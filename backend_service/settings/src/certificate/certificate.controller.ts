import { getCertificates,createCertificate, updateCertificate, deleteCertificate } from './certificate.manager';
import sendResponse from '../common/response/response';

export const fetchCertificates = (req, res) => {
    const body = req.params;
    getCertificates(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}

export const addCertificate = (req, res) => {
    const body = req.body;
    createCertificate(body).then((response: any) => sendResponse(res, response.code, 1,201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,401, error.message, error.data))
}

export const editCertificate = (req, res) => {
    const body = req.body;
    updateCertificate(body).then((response: any) => sendResponse(res, response.code, 1,202, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,402, error.message, error.data))
}

export const deleteCertificates = (req, res) => {
    const body = req.params;
    deleteCertificate(body).then((response: any) => sendResponse(res, response.code, 1,203, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,403, error.message, error.data))
}