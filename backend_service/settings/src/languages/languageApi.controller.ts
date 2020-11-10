import {flushCache, listLanguages} from './langugaeApi.manager';
import sendResponse from '../common/response/response';
export const getLanguagesList = (req, res) => {
    listLanguages().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

export const flushLanguagesListCache = (req, res) => {
    flushCache().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}